/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n  query GetCarDetailUser($carId: String!) {\n    getCarDetailUser(carId: $carId) {\n      message\n      success\n      data {\n        id\n        launchYear\n        totalRun\n        noOfOwners\n        model\n        companyName\n        variant\n        registrationNumber\n        fuelType\n        transmission\n        status\n        createdAt\n        gallery {\n          id\n          fileType\n          thumbnail\n          createdAt\n          updatedAt\n          documents {\n            id\n            fileName\n            path\n            documentType\n          }\n        }\n        lead\n        products {\n          amount\n          currency\n          discountedAmount\n          documents {\n            documentType\n            id\n            fileName\n            path\n          }\n          fileType\n          id\n          productType\n          thumbnail\n        }\n      }\n    }\n  }\n':
    types.GetCarDetailUserDocument,
  '\n  query GetCarsUser(\n    $page: Float\n    $limit: Float\n    $searchString: String\n    $filter: [CarsFilterInput!]\n    $suggestedColumn: String\n  ) {\n    getCarsUser(\n      page: $page\n      limit: $limit\n      searchString: $searchString\n      filter: $filter\n      suggestedColumn: $suggestedColumn\n    ) {\n      message\n      success\n      data {\n        id\n        launchYear\n        totalRun\n        noOfOwners\n        model\n        companyName\n        variant\n        registrationNumber\n        fuelType\n        transmission\n        status\n        gallery {\n          id\n          fileType\n          thumbnail\n          createdAt\n          updatedAt\n          documents {\n            documentType\n            fileName\n            id\n            path\n          }\n        }\n        lead\n        userId\n        updatedAt\n        createdAt\n      }\n      pagination {\n        maxPage\n        currentPage\n        total\n        limit\n      }\n    }\n  }\n':
    types.GetCarsUserDocument,
  '\n  mutation CreateOrderForEndUser(\n    $carId: String!\n    $bundleId: String\n    $products: [String!]\n  ) {\n    createOrderForEndUser(\n      carId: $carId\n      bundleId: $bundleId\n      products: $products\n    ) {\n      message\n      success\n      order {\n        id\n        entity\n        amount\n        currency\n        description\n        order_id\n        name\n        theme {\n          color\n        }\n        prefill {\n          name\n          email\n          contact\n        }\n      }\n    }\n  }\n':
    types.CreateOrderForEndUserDocument,
  '\n  query GetCarBundle($bundleId: String!, $carId: String!) {\n    getCarBundle(bundleId: $bundleId, carId: $carId) {\n      message\n      success\n      data {\n        id\n        fileType\n        thumbnail\n        amount\n        bundledItems {\n          CarProduct {\n            id\n            fileType\n            amount\n            productType\n            thumbnail\n            CarProductDocuments {\n              documentType\n              fileName\n              path\n            }\n          }\n        }\n      }\n    }\n  }\n':
    types.GetCarBundleDocument,
  '\n  query GetContactData($page: Float, $limit: Float) {\n    getContactData(page: $page, limit: $limit) {\n      message\n      success\n      data {\n        id\n        contactMessage {\n          message\n          createdAt\n          updatedAt\n        }\n        alternatePhone\n        alternateEmail\n        car {\n          id\n          launchYear\n          totalRun\n          noOfOwners\n          model\n          companyName\n          variant\n          registrationNumber\n          fuelType\n          transmission\n          status\n          createdAt\n          updatedAt\n        }\n      }\n      pagination {\n        maxPage\n        currentPage\n        total\n        limit\n      }\n    }\n  }\n':
    types.GetContactDataDocument,
  '\n  mutation GetNewTokensQuery($refreshToken: String!) {\n    getNewTokens(refreshToken: $refreshToken) {\n      accessToken\n      refreshToken\n    }\n  }\n':
    types.GetNewTokensQueryDocument,
  '\n  query GetUserDetails {\n    getUserDetails {\n      id\n      firstName\n      lastName\n      email\n      phoneNumber\n      location\n    }\n  }\n':
    types.GetUserDetailsDocument,
  '\n  mutation CustomerLoginWithPhoneOtp($phoneNumber: String!) {\n    customerLoginWithPhoneOtp(phoneNumber: $phoneNumber) {\n      message\n      success\n    }\n  }\n':
    types.CustomerLoginWithPhoneOtpDocument,
  '\n  query GetPaymentHistory($paymentId: String!) {\n    getPaymentHistory(paymentId: $paymentId) {\n      message\n      success\n      data {\n        id\n        quotationId\n        quotation {\n          car {\n            registrationNumber\n          }\n        }\n        razorpayOrderId\n        productsPurchased {\n          id\n          fileType\n          productType\n          amount\n          discountedAmount\n          currency\n          thumbnail\n          documents {\n            id\n            fileName\n            path\n            documentType\n          }\n          createdAt\n          updatedAt\n        }\n        bundleDetails {\n          id\n          fileType\n          productType\n          amount\n          discountedAmount\n          currency\n          thumbnail\n          createdAt\n          updatedAt\n        }\n        carId\n        userId\n        razorpayPaymentId\n        amount\n        invoiceStatus\n        amountPaid\n        amountDue\n        receipt\n        createdAt\n        updatedAt\n      }\n    }\n  }\n':
    types.GetPaymentHistoryDocument,
  '\n  query GetPaymentHistoryList(\n    $page: Float\n    $limit: Float\n    $userId: String\n    $filter: [UserInvoiceFilterInput!]\n  ) {\n    getPaymentHistoryList(\n      page: $page\n      limit: $limit\n      userId: $userId\n      filter: $filter\n    ) {\n      message\n      success\n      data {\n        id\n        quotationId\n        quotation {\n          car {\n            registrationNumber\n          }\n        }\n        razorpayOrderId\n        productsPurchased {\n          id\n          fileType\n          productType\n          amount\n          discountedAmount\n          currency\n          thumbnail\n          documents {\n            id\n            fileName\n            path\n            documentType\n          }\n          createdAt\n          updatedAt\n        }\n        bundleDetails {\n          id\n          fileType\n          productType\n          amount\n          discountedAmount\n          currency\n          thumbnail\n          createdAt\n          updatedAt\n        }\n        carId\n        userId\n        razorpayPaymentId\n        amount\n        invoiceStatus\n        amountPaid\n        amountDue\n        receipt\n        createdAt\n        updatedAt\n      }\n      pagination {\n        maxPage\n        currentPage\n        total\n        limit\n      }\n    }\n  }\n':
    types.GetPaymentHistoryListDocument,
  '\n  mutation ContactFormSubmit(\n    $formData: ContactDataDTO!\n    $registerInput: ContactFormRegisterInput\n  ) {\n    contactFormSubmit(formData: $formData, registerInput: $registerInput) {\n      message\n      success\n    }\n  }\n':
    types.ContactFormSubmitDocument,
  '\n  mutation RegisterUser(\n    $phoneNumber: String!\n    $firstName: String\n    $lastName: String\n  ) {\n    registerUser(\n      phoneNumber: $phoneNumber\n      firstName: $firstName\n      lastName: $lastName\n    ) {\n      message\n      success\n    }\n  }\n':
    types.RegisterUserDocument,
  '\n  mutation UpdateEndUserDetail(\n    $firstName: String\n    $lastName: String\n    $email: String\n    $location: String\n  ) {\n    updateEndUserDetail(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      location: $location\n    ) {\n      message\n      success\n      data {\n        id\n        firstName\n        lastName\n        location\n        email\n        phoneNumber\n      }\n    }\n  }\n':
    types.UpdateEndUserDetailDocument,
  '\n  mutation UpdateDealer(\n    $dealerId: String\n    $firstName: String\n    $lastName: String\n    $companyName: String\n    $location: String\n    $email: String\n  ) {\n    updateDealer(\n      dealerId: $dealerId\n      firstName: $firstName\n      lastName: $lastName\n      companyName: $companyName\n      location: $location\n      email: $email\n    ) {\n      message\n      success\n      data {\n        id\n        firstName\n        lastName\n        companyName\n        location\n        status\n        email\n        phoneNumber\n        documents {\n          id\n          userId\n          fileName\n          path\n        }\n      }\n    }\n  }\n':
    types.UpdateDealerDocument,
  '\n  mutation RegisterDealerWithPhoneNumberViaOtp($phoneNumber: String!) {\n    registerDealerWithPhoneNumberViaOtp(phoneNumber: $phoneNumber) {\n      message\n      success\n    }\n  }\n':
    types.RegisterDealerWithPhoneNumberViaOtpDocument,
  '\n  mutation VerifyRazorpayPaymentForEndUser(\n    $razorpayOrderId: String!\n    $razorpayPaymentId: String!\n    $razorpaySignature: String!\n  ) {\n    verifyRazorpayPaymentForEndUser(\n      razorpayOrderId: $razorpayOrderId\n      razorpayPaymentId: $razorpayPaymentId\n      razorpaySignature: $razorpaySignature\n    ) {\n      message\n      success\n      data {\n        paymentId\n      }\n    }\n  }\n':
    types.VerifyRazorpayPaymentForEndUserDocument,
  '\n  mutation VerifyLoginPhoneOtp($phoneNumber: String!, $otp: String!) {\n    verifyLoginPhoneOtp(phoneNumber: $phoneNumber, otp: $otp) {\n      message\n      success\n      signInToken {\n        accessToken\n        refreshToken\n      }\n      dealerId\n    }\n  }\n':
    types.VerifyLoginPhoneOtpDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetCarDetailUser($carId: String!) {\n    getCarDetailUser(carId: $carId) {\n      message\n      success\n      data {\n        id\n        launchYear\n        totalRun\n        noOfOwners\n        model\n        companyName\n        variant\n        registrationNumber\n        fuelType\n        transmission\n        status\n        createdAt\n        gallery {\n          id\n          fileType\n          thumbnail\n          createdAt\n          updatedAt\n          documents {\n            id\n            fileName\n            path\n            documentType\n          }\n        }\n        lead\n        products {\n          amount\n          currency\n          discountedAmount\n          documents {\n            documentType\n            id\n            fileName\n            path\n          }\n          fileType\n          id\n          productType\n          thumbnail\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetCarDetailUser($carId: String!) {\n    getCarDetailUser(carId: $carId) {\n      message\n      success\n      data {\n        id\n        launchYear\n        totalRun\n        noOfOwners\n        model\n        companyName\n        variant\n        registrationNumber\n        fuelType\n        transmission\n        status\n        createdAt\n        gallery {\n          id\n          fileType\n          thumbnail\n          createdAt\n          updatedAt\n          documents {\n            id\n            fileName\n            path\n            documentType\n          }\n        }\n        lead\n        products {\n          amount\n          currency\n          discountedAmount\n          documents {\n            documentType\n            id\n            fileName\n            path\n          }\n          fileType\n          id\n          productType\n          thumbnail\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetCarsUser(\n    $page: Float\n    $limit: Float\n    $searchString: String\n    $filter: [CarsFilterInput!]\n    $suggestedColumn: String\n  ) {\n    getCarsUser(\n      page: $page\n      limit: $limit\n      searchString: $searchString\n      filter: $filter\n      suggestedColumn: $suggestedColumn\n    ) {\n      message\n      success\n      data {\n        id\n        launchYear\n        totalRun\n        noOfOwners\n        model\n        companyName\n        variant\n        registrationNumber\n        fuelType\n        transmission\n        status\n        gallery {\n          id\n          fileType\n          thumbnail\n          createdAt\n          updatedAt\n          documents {\n            documentType\n            fileName\n            id\n            path\n          }\n        }\n        lead\n        userId\n        updatedAt\n        createdAt\n      }\n      pagination {\n        maxPage\n        currentPage\n        total\n        limit\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetCarsUser(\n    $page: Float\n    $limit: Float\n    $searchString: String\n    $filter: [CarsFilterInput!]\n    $suggestedColumn: String\n  ) {\n    getCarsUser(\n      page: $page\n      limit: $limit\n      searchString: $searchString\n      filter: $filter\n      suggestedColumn: $suggestedColumn\n    ) {\n      message\n      success\n      data {\n        id\n        launchYear\n        totalRun\n        noOfOwners\n        model\n        companyName\n        variant\n        registrationNumber\n        fuelType\n        transmission\n        status\n        gallery {\n          id\n          fileType\n          thumbnail\n          createdAt\n          updatedAt\n          documents {\n            documentType\n            fileName\n            id\n            path\n          }\n        }\n        lead\n        userId\n        updatedAt\n        createdAt\n      }\n      pagination {\n        maxPage\n        currentPage\n        total\n        limit\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateOrderForEndUser(\n    $carId: String!\n    $bundleId: String\n    $products: [String!]\n  ) {\n    createOrderForEndUser(\n      carId: $carId\n      bundleId: $bundleId\n      products: $products\n    ) {\n      message\n      success\n      order {\n        id\n        entity\n        amount\n        currency\n        description\n        order_id\n        name\n        theme {\n          color\n        }\n        prefill {\n          name\n          email\n          contact\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  mutation CreateOrderForEndUser(\n    $carId: String!\n    $bundleId: String\n    $products: [String!]\n  ) {\n    createOrderForEndUser(\n      carId: $carId\n      bundleId: $bundleId\n      products: $products\n    ) {\n      message\n      success\n      order {\n        id\n        entity\n        amount\n        currency\n        description\n        order_id\n        name\n        theme {\n          color\n        }\n        prefill {\n          name\n          email\n          contact\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetCarBundle($bundleId: String!, $carId: String!) {\n    getCarBundle(bundleId: $bundleId, carId: $carId) {\n      message\n      success\n      data {\n        id\n        fileType\n        thumbnail\n        amount\n        bundledItems {\n          CarProduct {\n            id\n            fileType\n            amount\n            productType\n            thumbnail\n            CarProductDocuments {\n              documentType\n              fileName\n              path\n            }\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetCarBundle($bundleId: String!, $carId: String!) {\n    getCarBundle(bundleId: $bundleId, carId: $carId) {\n      message\n      success\n      data {\n        id\n        fileType\n        thumbnail\n        amount\n        bundledItems {\n          CarProduct {\n            id\n            fileType\n            amount\n            productType\n            thumbnail\n            CarProductDocuments {\n              documentType\n              fileName\n              path\n            }\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetContactData($page: Float, $limit: Float) {\n    getContactData(page: $page, limit: $limit) {\n      message\n      success\n      data {\n        id\n        contactMessage {\n          message\n          createdAt\n          updatedAt\n        }\n        alternatePhone\n        alternateEmail\n        car {\n          id\n          launchYear\n          totalRun\n          noOfOwners\n          model\n          companyName\n          variant\n          registrationNumber\n          fuelType\n          transmission\n          status\n          createdAt\n          updatedAt\n        }\n      }\n      pagination {\n        maxPage\n        currentPage\n        total\n        limit\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetContactData($page: Float, $limit: Float) {\n    getContactData(page: $page, limit: $limit) {\n      message\n      success\n      data {\n        id\n        contactMessage {\n          message\n          createdAt\n          updatedAt\n        }\n        alternatePhone\n        alternateEmail\n        car {\n          id\n          launchYear\n          totalRun\n          noOfOwners\n          model\n          companyName\n          variant\n          registrationNumber\n          fuelType\n          transmission\n          status\n          createdAt\n          updatedAt\n        }\n      }\n      pagination {\n        maxPage\n        currentPage\n        total\n        limit\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation GetNewTokensQuery($refreshToken: String!) {\n    getNewTokens(refreshToken: $refreshToken) {\n      accessToken\n      refreshToken\n    }\n  }\n'
): (typeof documents)['\n  mutation GetNewTokensQuery($refreshToken: String!) {\n    getNewTokens(refreshToken: $refreshToken) {\n      accessToken\n      refreshToken\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetUserDetails {\n    getUserDetails {\n      id\n      firstName\n      lastName\n      email\n      phoneNumber\n      location\n    }\n  }\n'
): (typeof documents)['\n  query GetUserDetails {\n    getUserDetails {\n      id\n      firstName\n      lastName\n      email\n      phoneNumber\n      location\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CustomerLoginWithPhoneOtp($phoneNumber: String!) {\n    customerLoginWithPhoneOtp(phoneNumber: $phoneNumber) {\n      message\n      success\n    }\n  }\n'
): (typeof documents)['\n  mutation CustomerLoginWithPhoneOtp($phoneNumber: String!) {\n    customerLoginWithPhoneOtp(phoneNumber: $phoneNumber) {\n      message\n      success\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetPaymentHistory($paymentId: String!) {\n    getPaymentHistory(paymentId: $paymentId) {\n      message\n      success\n      data {\n        id\n        quotationId\n        quotation {\n          car {\n            registrationNumber\n          }\n        }\n        razorpayOrderId\n        productsPurchased {\n          id\n          fileType\n          productType\n          amount\n          discountedAmount\n          currency\n          thumbnail\n          documents {\n            id\n            fileName\n            path\n            documentType\n          }\n          createdAt\n          updatedAt\n        }\n        bundleDetails {\n          id\n          fileType\n          productType\n          amount\n          discountedAmount\n          currency\n          thumbnail\n          createdAt\n          updatedAt\n        }\n        carId\n        userId\n        razorpayPaymentId\n        amount\n        invoiceStatus\n        amountPaid\n        amountDue\n        receipt\n        createdAt\n        updatedAt\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetPaymentHistory($paymentId: String!) {\n    getPaymentHistory(paymentId: $paymentId) {\n      message\n      success\n      data {\n        id\n        quotationId\n        quotation {\n          car {\n            registrationNumber\n          }\n        }\n        razorpayOrderId\n        productsPurchased {\n          id\n          fileType\n          productType\n          amount\n          discountedAmount\n          currency\n          thumbnail\n          documents {\n            id\n            fileName\n            path\n            documentType\n          }\n          createdAt\n          updatedAt\n        }\n        bundleDetails {\n          id\n          fileType\n          productType\n          amount\n          discountedAmount\n          currency\n          thumbnail\n          createdAt\n          updatedAt\n        }\n        carId\n        userId\n        razorpayPaymentId\n        amount\n        invoiceStatus\n        amountPaid\n        amountDue\n        receipt\n        createdAt\n        updatedAt\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetPaymentHistoryList(\n    $page: Float\n    $limit: Float\n    $userId: String\n    $filter: [UserInvoiceFilterInput!]\n  ) {\n    getPaymentHistoryList(\n      page: $page\n      limit: $limit\n      userId: $userId\n      filter: $filter\n    ) {\n      message\n      success\n      data {\n        id\n        quotationId\n        quotation {\n          car {\n            registrationNumber\n          }\n        }\n        razorpayOrderId\n        productsPurchased {\n          id\n          fileType\n          productType\n          amount\n          discountedAmount\n          currency\n          thumbnail\n          documents {\n            id\n            fileName\n            path\n            documentType\n          }\n          createdAt\n          updatedAt\n        }\n        bundleDetails {\n          id\n          fileType\n          productType\n          amount\n          discountedAmount\n          currency\n          thumbnail\n          createdAt\n          updatedAt\n        }\n        carId\n        userId\n        razorpayPaymentId\n        amount\n        invoiceStatus\n        amountPaid\n        amountDue\n        receipt\n        createdAt\n        updatedAt\n      }\n      pagination {\n        maxPage\n        currentPage\n        total\n        limit\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetPaymentHistoryList(\n    $page: Float\n    $limit: Float\n    $userId: String\n    $filter: [UserInvoiceFilterInput!]\n  ) {\n    getPaymentHistoryList(\n      page: $page\n      limit: $limit\n      userId: $userId\n      filter: $filter\n    ) {\n      message\n      success\n      data {\n        id\n        quotationId\n        quotation {\n          car {\n            registrationNumber\n          }\n        }\n        razorpayOrderId\n        productsPurchased {\n          id\n          fileType\n          productType\n          amount\n          discountedAmount\n          currency\n          thumbnail\n          documents {\n            id\n            fileName\n            path\n            documentType\n          }\n          createdAt\n          updatedAt\n        }\n        bundleDetails {\n          id\n          fileType\n          productType\n          amount\n          discountedAmount\n          currency\n          thumbnail\n          createdAt\n          updatedAt\n        }\n        carId\n        userId\n        razorpayPaymentId\n        amount\n        invoiceStatus\n        amountPaid\n        amountDue\n        receipt\n        createdAt\n        updatedAt\n      }\n      pagination {\n        maxPage\n        currentPage\n        total\n        limit\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ContactFormSubmit(\n    $formData: ContactDataDTO!\n    $registerInput: ContactFormRegisterInput\n  ) {\n    contactFormSubmit(formData: $formData, registerInput: $registerInput) {\n      message\n      success\n    }\n  }\n'
): (typeof documents)['\n  mutation ContactFormSubmit(\n    $formData: ContactDataDTO!\n    $registerInput: ContactFormRegisterInput\n  ) {\n    contactFormSubmit(formData: $formData, registerInput: $registerInput) {\n      message\n      success\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RegisterUser(\n    $phoneNumber: String!\n    $firstName: String\n    $lastName: String\n  ) {\n    registerUser(\n      phoneNumber: $phoneNumber\n      firstName: $firstName\n      lastName: $lastName\n    ) {\n      message\n      success\n    }\n  }\n'
): (typeof documents)['\n  mutation RegisterUser(\n    $phoneNumber: String!\n    $firstName: String\n    $lastName: String\n  ) {\n    registerUser(\n      phoneNumber: $phoneNumber\n      firstName: $firstName\n      lastName: $lastName\n    ) {\n      message\n      success\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateEndUserDetail(\n    $firstName: String\n    $lastName: String\n    $email: String\n    $location: String\n  ) {\n    updateEndUserDetail(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      location: $location\n    ) {\n      message\n      success\n      data {\n        id\n        firstName\n        lastName\n        location\n        email\n        phoneNumber\n      }\n    }\n  }\n'
): (typeof documents)['\n  mutation UpdateEndUserDetail(\n    $firstName: String\n    $lastName: String\n    $email: String\n    $location: String\n  ) {\n    updateEndUserDetail(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      location: $location\n    ) {\n      message\n      success\n      data {\n        id\n        firstName\n        lastName\n        location\n        email\n        phoneNumber\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateDealer(\n    $dealerId: String\n    $firstName: String\n    $lastName: String\n    $companyName: String\n    $location: String\n    $email: String\n  ) {\n    updateDealer(\n      dealerId: $dealerId\n      firstName: $firstName\n      lastName: $lastName\n      companyName: $companyName\n      location: $location\n      email: $email\n    ) {\n      message\n      success\n      data {\n        id\n        firstName\n        lastName\n        companyName\n        location\n        status\n        email\n        phoneNumber\n        documents {\n          id\n          userId\n          fileName\n          path\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  mutation UpdateDealer(\n    $dealerId: String\n    $firstName: String\n    $lastName: String\n    $companyName: String\n    $location: String\n    $email: String\n  ) {\n    updateDealer(\n      dealerId: $dealerId\n      firstName: $firstName\n      lastName: $lastName\n      companyName: $companyName\n      location: $location\n      email: $email\n    ) {\n      message\n      success\n      data {\n        id\n        firstName\n        lastName\n        companyName\n        location\n        status\n        email\n        phoneNumber\n        documents {\n          id\n          userId\n          fileName\n          path\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RegisterDealerWithPhoneNumberViaOtp($phoneNumber: String!) {\n    registerDealerWithPhoneNumberViaOtp(phoneNumber: $phoneNumber) {\n      message\n      success\n    }\n  }\n'
): (typeof documents)['\n  mutation RegisterDealerWithPhoneNumberViaOtp($phoneNumber: String!) {\n    registerDealerWithPhoneNumberViaOtp(phoneNumber: $phoneNumber) {\n      message\n      success\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation VerifyRazorpayPaymentForEndUser(\n    $razorpayOrderId: String!\n    $razorpayPaymentId: String!\n    $razorpaySignature: String!\n  ) {\n    verifyRazorpayPaymentForEndUser(\n      razorpayOrderId: $razorpayOrderId\n      razorpayPaymentId: $razorpayPaymentId\n      razorpaySignature: $razorpaySignature\n    ) {\n      message\n      success\n      data {\n        paymentId\n      }\n    }\n  }\n'
): (typeof documents)['\n  mutation VerifyRazorpayPaymentForEndUser(\n    $razorpayOrderId: String!\n    $razorpayPaymentId: String!\n    $razorpaySignature: String!\n  ) {\n    verifyRazorpayPaymentForEndUser(\n      razorpayOrderId: $razorpayOrderId\n      razorpayPaymentId: $razorpayPaymentId\n      razorpaySignature: $razorpaySignature\n    ) {\n      message\n      success\n      data {\n        paymentId\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation VerifyLoginPhoneOtp($phoneNumber: String!, $otp: String!) {\n    verifyLoginPhoneOtp(phoneNumber: $phoneNumber, otp: $otp) {\n      message\n      success\n      signInToken {\n        accessToken\n        refreshToken\n      }\n      dealerId\n    }\n  }\n'
): (typeof documents)['\n  mutation VerifyLoginPhoneOtp($phoneNumber: String!, $otp: String!) {\n    verifyLoginPhoneOtp(phoneNumber: $phoneNumber, otp: $otp) {\n      message\n      success\n      signInToken {\n        accessToken\n        refreshToken\n      }\n      dealerId\n    }\n  }\n'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
