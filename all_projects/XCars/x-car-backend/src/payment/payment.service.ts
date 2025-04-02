import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderInput } from './dto/create-order.dto';
import { CheckerService } from 'src/checker/checker.service';
import { Invoices } from 'razorpay/dist/types/invoices';
import CustomError from 'src/global-filters/custom-error-filter';
import { StatusCodes } from 'src/common/enum/status-codes.enum';
import ErrorMessage from 'src/global-filters/error-message-filter';
import {
  CarStatus,
  LeadType,
  QuotationStatus,
  RazorpayOrderStatus,
} from '@prisma/client';
import * as crypto from 'crypto';
import { CreateEndUserOrderInput } from './dto/create-end-user-order.dto';
import { HelperService } from 'src/helper/helper.service';
import * as path from 'path';
import * as fs from 'fs/promises';
import { EmailNotificationService } from 'src/email-notification/email-notification.service';
import { getISTDateTimeString } from 'src/common/helper';

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor(
    private prismaService: PrismaService,
    private checkerService: CheckerService,
    private emailNotificationService: EmailNotificationService,
    private configService: ConfigService,
    private helperService: HelperService,
  ) {
    const config = {
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    };
    this.razorpay = new Razorpay(config);
  }

  async getCarId({
    razorpayOrderId,
  }: {
    razorpayOrderId: string;
  }): Promise<string> {
    try {
      const invoiceDetails = await this.prismaService.invoiceRecord.findUnique({
        where: {
          razorpayOrderId,
        },
        include: {
          quotation: true,
        },
      });

      return invoiceDetails?.quotation?.carId;
    } catch (error) {
      throw error;
    }
  }

  async createOrder(createOrderInput: CreateOrderInput) {
    const dealer = await this.checkerService.getUserById({
      id: createOrderInput.dealerId,
    });
    if (!dealer?.firstName)
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.notFound('Dealer name'),
      );
    const quotation = await this.checkerService.getQuotation({
      quotationId: createOrderInput.QuotationId,
    });

    if (quotation.dealerId !== dealer.id) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.notFound('Quotation'),
      );
    }

    const existingInvoice = await this.prismaService.invoiceRecord.findUnique({
      where: {
        quotationId: quotation.id,
      },
    });

    if (existingInvoice?.invoiceStatus === RazorpayOrderStatus.PAID) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.custom('Quotation already paid'),
      );
    }

    if (existingInvoice?.invoiceStatus === RazorpayOrderStatus.CREATED) {
      const orderDetails = {
        order: {
          id: existingInvoice.razorpayOrderId,
          description: existingInvoice?.description ?? 'Quotation payment',
          amount: existingInvoice.amount, // Amount is in the smallest unit (paise for INR)
          currency: this.configService.get<string>('CURRENCY'),
          amount_paid: existingInvoice.amountPaid,
          receipt: existingInvoice?.receipt || '',
          amount_due: existingInvoice.amountDue,
          order_id: existingInvoice.razorpayOrderId,
          prefill: {
            name: `${dealer.firstName} ${dealer.lastName}` || '',
            email: dealer.email,
            contact: dealer.phoneNumber ?? '',
          },
        },
        message: 'Razorpay order created.',
        success: true,
      };

      return orderDetails;
    }

    let description = 'Quotation payment';
    const options: Invoices.RazorpayInvoiceCreateRequestBody = {
      type: 'link',
      description,
      date: Math.floor(Date.now() / 1000), // Timestamp in seconds
      amount: quotation.quotationDetails.amount * 100,
      customer: {
        name: `${dealer.firstName} ${dealer.lastName}`,
        email: dealer.email,
        contact: dealer.phoneNumber,
      },
      line_items: [],
      sms_notify: 0,
      email_notify: 0,
    };

    const quotationDetails =
      await this.prismaService.quotationDetails.findUnique({
        where: { quotationId: quotation.id },
      });

    description = `Quotation against no of lead ${quotationDetails.noOfLeads}, expiry ${quotationDetails.expiryDate}`;
    options['line_items'].push({
      name: 'Quotation',
      description,
      amount: quotation.quotationDetails.amount * 100,
      currency: 'INR',
      quantity: 1,
    });

    try {
      const invoice = await this.razorpay.invoices.create(options);
      await this.prismaService.$transaction(async (tx) => {
        if (quotation?.invoiceRecord) {
          await tx.invoiceRecord.delete({
            where: {
              id: quotation.invoiceRecord.id,
            },
          });
          await tx.quotation.update({
            where: {
              id: quotation.id,
            },
            data: {
              quotationStatus: QuotationStatus.PENDING,
            },
          });
        }

        await tx.invoiceRecord.create({
          data: {
            quotationId: quotation.id,
            carId: quotation.carId,
            userId: quotation.dealerId,
            description,
            razorpayOrderId: invoice.order_id,
            invoiceStatus: RazorpayOrderStatus.CREATED,
            amount: Number(invoice.amount),
            receipt: invoice.short_url,
            amountPaid: invoice.amount_paid,
            amountDue: invoice.amount_due,
          },
        });

        await tx.paymentLogs.create({
          data: {
            razorpayOrderId: invoice.id,
          },
        });
      });

      return {
        order: {
          id: invoice.order_id,
          description,
          amount: Number(invoice.amount),
          currency: invoice.currency,
          amount_paid: Number(invoice.amount_paid),
          receipt: invoice.receipt || '',
          amount_due: Number(invoice.amount_due),
          order_id: invoice.order_id,
          prefill: {
            name: `${dealer.firstName} ${dealer.lastName}` || '',
            email: dealer.email,
            contact: dealer.phoneNumber ?? '',
          },
        },
        message: 'Razorpay order created.',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyPayment(paymentDetails: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    try {
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(
          paymentDetails.razorpayOrderId +
            '|' +
            paymentDetails.razorpayPaymentId,
        )
        .digest('hex');

      return generatedSignature === paymentDetails.razorpaySignature;
    } catch (error) {
      throw error;
    }
  }

  async getOrderDetails({ razorpayOrderId }: { razorpayOrderId: string }) {
    try {
      const orderDetails = await this.razorpay.orders.fetch(razorpayOrderId);
      return orderDetails;
    } catch (error) {
      throw error;
    }
  }

  async updatePaymentStatusOnSuccess({
    razorpayOrderId,
    razorpayPaymentId,
  }: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
  }) {
    try {
      const orderDetails = await this.getOrderDetails({ razorpayOrderId });

      await this.prismaService.$transaction(async (tx) => {
        const invoice = await tx.invoiceRecord.update({
          where: {
            razorpayOrderId,
          },
          data: {
            invoiceStatus: RazorpayOrderStatus.PAID,
            amountDue: orderDetails.amount_due,
            amountPaid: orderDetails.amount_paid,
          },
          include: {
            car: true,
            quotation: {
              include: {
                quotationDetails: true,
              },
            },
          },
        });
        if (invoice?.car.carStatus === CarStatus.APPROVED) {
          await tx.quotation.update({
            where: {
              id: invoice.quotationId,
            },
            data: {
              quotationStatus: QuotationStatus.ACTIVE,
            },
          });

          await tx.quotationDetails.update({
            where: {
              quotationId: invoice.quotationId,
            },
            data: {
              expiryDate: this.helperService.getExpiryDate(
                invoice.quotation.quotationDetails.validityDays,
              ),
              startDate: new Date(),
            },
          });
        } else {
          await tx.quotation.update({
            where: {
              id: invoice.quotationId,
            },
            data: {
              quotationStatus: QuotationStatus.PAID,
            },
          });
        }

        await tx.paymentLogs.upsert({
          where: {
            razorpayOrderId,
          },
          create: {
            razorpayOrderId,
            razorpayPaymentId,
          },
          update: {
            razorpayOrderId,
            razorpayPaymentId,
          },
        });
      });
    } catch (error) {
      throw error;
    }
  }

  async updatePaymentStatusOnFailure({
    razorpayOrderId,
    razorpayPaymentId,
  }: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
  }) {
    try {
      const orderDetails = await this.getOrderDetails({ razorpayOrderId });

      await this.prismaService.invoiceRecord.update({
        where: {
          razorpayOrderId,
        },
        data: {
          invoiceStatus: RazorpayOrderStatus.ATTEMPTED,
          amountDue: orderDetails.amount_due,
          amountPaid: orderDetails.amount_paid,
        },
      });

      await this.prismaService.$transaction(async (tx) => {
        await tx.invoiceRecord.update({
          where: {
            razorpayOrderId,
          },
          data: {
            invoiceStatus: RazorpayOrderStatus.ATTEMPTED,
          },
        });
        await tx.paymentLogs.upsert({
          where: {
            razorpayOrderId,
          },
          create: {
            razorpayOrderId,
            razorpayPaymentId,
          },
          update: {
            razorpayOrderId,
            razorpayPaymentId,
          },
        });
      });
    } catch (error) {
      throw error;
    }
  }

  async createOrderForEndUser(
    createEndUserOrderInput: CreateEndUserOrderInput,
  ) {
    const { userId, carId, products, bundleId } = createEndUserOrderInput;
    const user = await this.checkerService.getUserById({
      id: userId,
    });
    if (!user.id) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.notFound('User'),
      );
    }

    const carData = await this.prismaService.car.findUnique({
      where: { id: carId, carStatus: CarStatus.APPROVED },
    });

    if (!carData) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.invalid('car id!'),
      );
    } else if (carData?.carStatus !== CarStatus.APPROVED) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.invalid('car is not approved!'),
      );
    }

    let findInvoiceWhereParams = null;
    findInvoiceWhereParams = {
      productsPurchased: {
        hasEvery: products,
      },
    };
    if (bundleId) {
      findInvoiceWhereParams = {
        bundleId,
      };
    }

    const findCreatedInvoice = await this.prismaService.invoiceRecord.findFirst(
      {
        where: {
          userId: userId,
          carId: carId,
          ...findInvoiceWhereParams,
          invoiceStatus: RazorpayOrderStatus.CREATED,
        },
      },
    );

    if (findCreatedInvoice?.id) {
      const orderDetails = {
        order: {
          id: findCreatedInvoice.razorpayOrderId,
          order_id: findCreatedInvoice.razorpayOrderId,
          entity: 'order',
          amount: findCreatedInvoice.amount,
          currency: findCreatedInvoice.currency,
          description:
            findCreatedInvoice?.description ??
            `payment for car ${carData.model} product`,
          name: 'x-cars',
          prefill: {
            name: `${user.firstName || ''} ${user.lastName || ''}`,
            email: user.email || '',
            contact: user.phoneNumber ?? '',
          },
          theme: {
            color: '#EF6E0C',
          },
        },
        message: 'Razorpay order created.',
        success: true,
      };
      return orderDetails;
    }

    const findCreatedInvoicePaid =
      await this.prismaService.invoiceRecord.findFirst({
        where: {
          userId: userId,
          carId: carId,
          ...findInvoiceWhereParams,
          invoiceStatus: RazorpayOrderStatus.PAID,
        },
      });

    if (findCreatedInvoicePaid?.id) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.custom('Items already bought'),
      );
    }

    let amount = 0;
    let productsPurchased = [];
    let description = '';
    let options: Invoices.RazorpayInvoiceCreateRequestBody = {
      type: 'link',
      date: Math.floor(Date.now() / 1000), // Timestamp in seconds
      amount,
      description,
      customer: {
        name: `${user.firstName || ''} ${user.lastName || ''}`,
        email: user.email || '',
        contact: user.phoneNumber || '',
      },
      line_items: [],
      sms_notify: 0,
      email_notify: 0,
    };

    if (products?.length) {
      productsPurchased = products;
      for await (const productId of products) {
        const getProduct = await this.prismaService.carProduct.findUnique({
          where: {
            id: productId,
            deleted: false,
          },
        });
        if (!getProduct) {
          throw new CustomError(
            StatusCodes.BAD_REQUEST,
            ErrorMessage.notFound('Product'),
          );
        }

        amount += getProduct.discountedAmount;
        description = description + `${getProduct.fileType}`;
        options['line_items'].push({
          name: getProduct.fileType,
          description,
          amount,
          currency: 'INR',
          quantity: 1,
        });
      }
    } else if (bundleId) {
      const bundle = await this.prismaService.carProduct.findUnique({
        where: {
          id: bundleId,
        },
        include: {
          bundledItems: true,
        },
      });

      productsPurchased = bundle.bundledItems.map(
        (product) => product.productId,
      );

      amount += bundle.amount;
      description = `${bundle.fileType}`;
      options['line_items'].push({
        name: bundle.fileType,
        description: `${bundle.fileType}`,
        amount,
        currency: 'INR',
        quantity: 1,
      });
    }

    options = {
      ...options,
      description: `${description} (${carData.companyName} - ${carData.model})`,
      amount: amount * 100,
    };

    try {
      const invoice = await this.razorpay.invoices.create(options);

      await this.prismaService.$transaction(async (tx) => {
        await tx.invoiceRecord.create({
          data: {
            razorpayOrderId: invoice.order_id,
            productsPurchased,
            description,
            bundleId: bundleId ?? null,
            userId: createEndUserOrderInput.userId,
            carId: createEndUserOrderInput.carId,
            invoiceStatus: RazorpayOrderStatus.CREATED,
            amount: Number(invoice.amount),
            receipt: invoice.short_url,
            amountPaid: invoice.amount_paid,
            amountDue: invoice.amount_due,
          },
        });

        await tx.paymentLogs.create({
          data: {
            userId: createEndUserOrderInput.userId,
            carId: createEndUserOrderInput.carId,
            razorpayOrderId: invoice.order_id,
          },
        });
      });

      return {
        order: {
          id: invoice.order_id,
          order_id: invoice.order_id,
          entity: 'order',
          amount: invoice.amount,
          currency: invoice.currency,
          description,
          name: 'x-cars',
          prefill: {
            name: `${user.firstName || ''} ${user.lastName || ''}`,
            email: user.email ?? '',
            contact: user.phoneNumber ?? '',
          },
          theme: {
            color: '#EF6E0C',
          },
        },
        message: 'Razorpay order created.',
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateCarBasedPaymentStatusOnSuccess({
    razorpayOrderId,
    razorpayPaymentId,
  }: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
  }) {
    try {
      const orderDetails = await this.getOrderDetails({ razorpayOrderId });

      let paymentId = null;
      let carId = null;
      let leadId = null;

      await this.prismaService.$transaction(async (tx) => {
        const invoiceDetails = await tx.invoiceRecord.update({
          where: {
            razorpayOrderId,
          },
          data: {
            invoiceStatus: RazorpayOrderStatus.PAID,
            amountDue: orderDetails.amount_due,
            amountPaid: orderDetails.amount_paid,
            razorpayPaymentId,
          },
          include: { car: true },
        });

        carId = invoiceDetails.carId;
        paymentId = invoiceDetails.id;

        await tx.paymentLogs.update({
          where: {
            razorpayOrderId,
          },
          data: {
            razorpayPaymentId,
          },
        });

        for (const eachProductId of invoiceDetails.productsPurchased) {
          await tx.productsPurchased.upsert({
            where: {
              carProductId_userId: {
                carProductId: eachProductId,
                userId: invoiceDetails.userId,
              },
            },
            create: {
              carProductId: eachProductId,
              userId: invoiceDetails.userId,
              carId,
            },
            update: {
              carProductId: eachProductId,
              userId: invoiceDetails.userId,
              carId,
            },
          });
        }
        const leadPresent = await tx.leads.findFirst({
          where: {
            carId: invoiceDetails.carId,
            userId: invoiceDetails.userId,
          },
        });

        if (!leadPresent?.id) {
          const lead = await tx.leads.create({
            data: {
              leadType: LeadType.HOT_LEAD,
              carId: invoiceDetails.carId,
              userId: invoiceDetails.userId,
            },
          });
          leadId = lead.id;
        }

        if (leadPresent && leadPresent.leadType === LeadType.LEAD) {
          await tx.leads.update({
            where: {
              id: leadPresent.id,
            },
            data: {
              leadType: LeadType.HOT_LEAD,
            },
          });
        }

        const endUser = await this.checkerService.getUserById({
          id: invoiceDetails.userId,
        });

        const emailTemplatePath = path.join(
          path.resolve(),
          'public',
          'templates',
          'contact.html',
        );
        const htmlTemplate = await fs.readFile(emailTemplatePath, 'utf8');
        await this.emailNotificationService.sendMail({
          recipientEmail: this.configService.get<string>('ADMIN_EMAIL'),
          emailTemplate: htmlTemplate,
          subject: 'Contact from User',
          name: `${endUser?.firstName || ''} ${endUser?.lastName ?? ''}`,
          date: getISTDateTimeString(invoiceDetails.createdAt),
        });

        const invoiceTemplatePath = path.join(
          path.resolve(),
          'public',
          'templates',
          'invoice.html',
        );
        const invoiceHtmlTemplate = await fs.readFile(
          invoiceTemplatePath,
          'utf8',
        );
        if (endUser?.email) {
          await this.emailNotificationService.sendMail({
            recipientEmail: endUser.email,
            emailTemplate: invoiceHtmlTemplate,
            subject: 'Invoice for user payment',
            name: `${endUser?.firstName || ''} ${endUser?.lastName ?? ''}`,
            date: getISTDateTimeString(invoiceDetails.createdAt),
            carInfo: `${invoiceDetails.car.companyName} ${invoiceDetails.car.model} ${invoiceDetails.car.variant} - ${invoiceDetails.car.launchYear}`,
            price: `${(invoiceDetails.amountPaid / 100).toFixed(2)}`,
            carDetailsLink: `https://dev.d32zfq3hdw15si.amplifyapp.com/buy-used-cars/${invoiceDetails.carId}`,
            invoiceLink: invoiceDetails.receipt,
            invoiceNumber: invoiceDetails.id,
          });
        }
      });

      if (leadId) {
        await this.helperService.autoAssignLeadToDealer({
          carId,
          leadId,
        });
      }

      return paymentId;
    } catch (error) {
      throw error;
    }
  }

  async updateCarBasedPaymentStatusOnFailure({
    razorpayOrderId,
    razorpayPaymentId,
  }: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
  }) {
    try {
      const orderDetails = await this.getOrderDetails({ razorpayOrderId });

      let paymentId = null;

      await this.prismaService.$transaction(async (tx) => {
        await tx.invoiceRecord.update({
          where: {
            razorpayOrderId,
          },
          data: {
            invoiceStatus: RazorpayOrderStatus.ATTEMPTED,
            amountDue: orderDetails.amount_due,
            amountPaid: orderDetails.amount_paid,
            razorpayPaymentId,
          },
        });

        const paymentLog = await tx.paymentLogs.update({
          where: {
            razorpayOrderId,
          },
          data: {
            razorpayPaymentId,
          },
        });

        paymentId = paymentLog.id;
      });

      return paymentId;
    } catch (error) {
      throw error;
    }
  }

  async initiateRefund({
    razorpayOrderId,
    amount,
    receipt,
    refundNote,
  }: {
    razorpayOrderId: string;
    amount: number;
    receipt: string;
    refundNote?: string;
  }) {
    try {
      const refundRes = await this.razorpay.payments.refund(razorpayOrderId, {
        amount: amount,
        speed: 'normal',
        notes: {
          notes_key_1: refundNote ?? '',
        },
        receipt: receipt,
      });

      if (!refundRes) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.custom('Error in fetching payment info.'),
        );
      }

      if (refundRes.entity !== 'refund' && refundRes.status !== 'processed') {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          ErrorMessage.custom('Refund was unsuccessful.'),
        );
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
