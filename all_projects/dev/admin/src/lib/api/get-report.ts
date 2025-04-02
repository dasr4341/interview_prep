import { client } from 'apiClient';
import { GetReport, GetReportVariables } from './../../generatedTypes';
import ExcelBuilder from 'lib/ExcelBuilder';
import dayjs from 'dayjs';
import _ from 'lodash';
import { getReportQuery } from 'lib/query/super-admin/get-report';
import { getGraphError } from 'lib/catch-error';
import PdfPrinter from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

export default async function getReport(variables: { customerId: number; type: 'pdf' | 'excel' }) {
  await new Promise(async (resolve, reject) => {
    let data: GetReport | null = null;

    try {
      const { data: response, errors } = await client.query<GetReport, GetReportVariables>({
        query: getReportQuery,
        variables: {
          customerId: variables.customerId,
        },
      });

      console.log(response, errors);

      data = response;
      if (errors && errors.length > 0) {
        const queryErrors = getGraphError(errors);
        console.log(queryErrors);
        reject(true);
        return;
      }
    } catch (e) {
      console.log(e);
      reject(true);
    }

    if (data && variables.type === 'excel') {
      const excelBuilder = new ExcelBuilder();

      const excelData = excelBuilder
        .createWorkSheet('sheet')
        // PDF Done
        .addHeader('Client Summary', 2, data.pretaaAdminGetCustomer?.name || '')
        .addTable(
          'clientSummary',
          [{ name: 'Department' }, { name: 'Total Employees' }, { name: 'Total Logins' }, { name: 'Number of Feedback Responses' }, { name: 'Average Number of Stars' }],
          (() => {
            const clientSummaryData = data.pretaaAdminGetClientSummary.data.map((r) => {
              return [r.department, r.num_of_employees, r.num_of_logins, r.total_feedbacks, r.avg_stars];
            });
            clientSummaryData.push([
              'Grand Total',
              data.pretaaAdminGetClientSummary.summary.totalEmployees || 0,
              data.pretaaAdminGetClientSummary.summary.totalLogins || 0,
              data.pretaaAdminGetClientSummary.summary.totalFeedbacks || 0,
              data.pretaaAdminGetClientSummary.summary.totalAverageStars || 0,
            ]);
            return clientSummaryData;
          })()
        )
        // PDF Done
        .addHeader('Companies', 2)
        .addTable(
          'companies',
          [
            { name: 'Total Companies Matched Across All Source Systems' },
            { name: 'Total Companies in CRM' },
            { name: 'Total Companies in CSM' },
            { name: 'Total Companies in Marketing' },
            { name: 'Average Company Views Per User' },
            { name: 'Average Prospect Views Per User' },
            { name: 'Average Customer Views Per User' },
          ],
          [
            (() => {
              const d = data.pretaaAdminGetCompaniesBySource;
              if (d) {
                return [d.total, d.totalInCrm, d.totalCsm, d.totalInMarketing, d.avgCompanyViews, d.avgProspectViews, d.avgCustomerViews];
              } else {
                return [];
              }
            })(),
          ]
        )
        // PDF Done
        .addHeader('Company Filters - General', 2)
        .addTable(
          'companiesFilterGeneral',
          [{ name: 'Title' }, { name: 'Count of Filters Including this Criterion' }, { name: 'Percent of All Filtering That Includes This Criterion' }],
          (() => {
            const d = data.pretaaAdminGetCompanyFilters;
            return [
              ['Starred', d?.filterCounts.starred, d?.percentages.starred],
              ['Customers', d?.filterCounts.customer, d?.percentages.customer],
              ['Prospect', d?.filterCounts.prospect, d?.percentages.prospect],
              ['Reference - Manual', d?.filterCounts.reference_manual, d?.percentages.reference_manual],
              ['Reference - Manual - Has Served', d?.filterCounts.has_served, d?.percentages.has_served],
              ['Reference - Manual - Have Offered', d?.filterCounts.has_offered, d?.percentages.has_offered],
              ['Reference - Surveyed', d?.filterCounts.surveyed, d?.percentages.surveyed],
              ['NPS Score', d?.filterCounts.nps_score, d?.percentages.nps_score],
              ['Industry', d?.filterCounts.industry, d?.percentages.industry],
              ['ARR', d?.filterCounts.arr, d?.percentages.arr],
              ['Seats', d?.filterCounts.employee_seats, d?.percentages.employee_seats],
              ['Products', d?.filterCounts.product, d?.percentages.product],
            ];
          })()
        )
        // PDF Done
        .addHeader('Company Filters - Product', 2)
        .addTable(
          'companiesFilterProduct',
          [{ name: 'Product' }, { name: 'Number of Times Filters Included This' }],
          (() => {
            return data.pretaaAdminGetCompanyFilterProduct.map((r) => {
              return [r.product, r.searchedCount];
            });
          })()
        )
        // PDF Done
        .addHeader('Company Filters - Industry', 2)
        .addTable(
          'companiesFilterIndustry',
          [{ name: 'Industry' }, { name: 'Number of Times Filters Included This' }],
          (() => {
            return data.pretaaAdminGetCompanyFilterIndustry.map((r) => {
              return [r.industry, r.searchedCount];
            });
          })()
        )
        // PDF Done
        .addHeader('Events', 2)
        .addTable(
          'events',
          [
            { name: 'Total Events Generated' },
            { name: 'Average Events Generated Per User' },
            { name: 'Total Event Details Views' },
            { name: 'Average Event Detail Views Per User' },
          ],
          [
            (() => {
              const d = data.pretaaAdminGetEventsReport;
              return [d.total_generated, d.avg_generated, d.total_details_views, d.avg_details_views];
            })(),
          ]
        )
        // PDF Done
        .addHeader('Top 50 Most Common Event Search Terms', 2)
        .addTable(
          'eventSearchTerm',
          [{ name: 'Search Term' }, { name: 'Number of Searches' }],
          (() => {
            return data.pretaaAdminGetTopEventSearchTerms.map((r) => {
              return [r.search_text, r.search_count];
            });
          })()
        )
        //PDF Done
        .addHeader('Event Filters - General', 2)
        .addTable(
          'eventFilterGeneral',
          [{ name: 'Label' }, { name: 'Percent of All Filtering That Includes This Criterion' }],
          (() => {
            const d = _.cloneDeep(data?.pretaaAdminGetEventFilters?.percentages) as any;
            delete d.__typename;
            const tableRows = [
              'Company Rating',
              'Contact Change',
              'Hidden',
              'In the news',
              'Launch',
              'My Companies',
              'Needs Attention',
              'Onboarding',
              'Performance',
              'Pipeline',
              'Potential Reference',
              'Product',
              'Renewal',
              'Revenue Change',
              'Stared',
              'Support',
              'Total Searched',
            ];
            const rows = Object.keys(d).map((key: string, index: number) => {
              return [tableRows[index], String(d[key])];
            });
            return rows;
          })()
        )
        // PDF Done
        .addHeader('References Given By Users', 2, '', [
          { label: 'Total Count', value: String(data.pretaaAdminReferencesGivenByUsers?.counts) || '0' },
          {
            label: 'Distinct Types Given (Comma Delimited)',
            value: data.pretaaAdminReferencesGivenByUsers?.commaDelimitedTypes || '',
          },
        ])
        .addTable(
          'referencesGivenByUsers',
          [
            { name: 'User Who Entered Reference' },
            { name: 'Action (Add/Delete)' },
            { name: 'Date/Time of Entry' },
            { name: 'Company' },
            { name: 'Types Given (Comma Delimited)' },
            { name: 'ARR' },
            { name: 'Industry' },
            { name: '# Employees' },
          ],
          [
            ...(data.pretaaAdminReferencesGivenByUsers?.references?.map((r) => {
              return [
                r.user?.email,
                `${r.isDeleted ? 'Delete' : 'Add'}`,
                r.createdAt,
                r.company.name,
                r.offerOptions.map((o) => o.offerOption.offerType).join(),
                r.company.annualRecurringRevenueVal?.data || '',
                r.company.companyIndustries.map((i) => i.industry.sector).join(','),
                r.company.employeeCount,
              ];
            }) || []),
          ]
        )
        // PDF Done
        .addHeader('References Given By Company', 2, '', [
          { label: 'Total Count', value: String(data.pretaaAdminReferencesGivenByCompanies?.counts || '') },
          {
            label: 'Distinct Types Given (Comma Delimited)',
            value: String(data.pretaaAdminReferencesGivenByCompanies?.commaDelimitedTypes || ''),
          },
        ])
        // API:
        .addTable(
          'referencesGivenByCompany',
          [{ name: 'Company' }, { name: 'Total' }, { name: 'Types Given (Comma Delimited)' }, { name: 'ARR' }, { name: 'Industry' }, { name: '# Employees' }],
          [
            ...(() => {
              let rows: any = [];

              if (data?.pretaaAdminReferencesGivenByCompanies?.reference) {
                rows = data?.pretaaAdminReferencesGivenByCompanies?.reference.map((r) => {
                  return [r.name, r.total, String(r.arr), r.arr, r.sectors, String(r.employees)];
                });
              }

              return rows;
            })(),
          ]
        )
        // PDF Done
        .addHeader('Willing Reference', 2, '', [
          { label: 'Total Count', value: String(data?.pretaaAdminWillingReferencesByCompany?.counts?.count) },
          {
            label: 'Distinct Types Given (Comma Delimited)',
            value: String(data?.pretaaAdminWillingReferencesByCompany?.counts?.allOfferTypesList),
          },
        ])
        .addTable(
          'willingReference',
          [{ name: 'Company' }, { name: 'Types (Comma Delimited)' }, { name: 'ARR' }, { name: 'Industry' }, { name: '# Employees' }],
          [
            ...(() => {
              let rows: any = [];
              if (data?.pretaaAdminWillingReferencesByCompany?.companies) {
                rows = data?.pretaaAdminWillingReferencesByCompany?.companies.map((r) => {
                  return [r.name, r.offerTypesList, r.annualRecurringRevenue, r.sectorList, r.employeeCount];
                });
              }

              return rows;
            })(),
          ]
        )
        // PDF Done
        .addHeader('Top 10 Ratings by ARR', 2)
        .addTable(
          'topRatingsByArr',
          [{ name: 'Company' }, { name: 'Total Happy' }, { name: 'Total Unhappy' }, { name: 'Total Neutral ' }, { name: 'ARR' }, { name: 'Industry' }, { name: '# Employees' }],
          (() => {
            return (
              data?.pretaaAdminGetCompanyRatingsByARR?.map((r) => {
                return [r.name, r.happy, r.unhappy, r.neutral, r.arr, r.sectors, r.employees];
              }) || []
            );
          })()
        )
        // PDF Done
        .addHeader('Top 10 Ratings by Total Ratings', 2)
        .addTable(
          'topRatingsByArr',
          [{ name: 'Company' }, { name: 'Total Happy' }, { name: 'Total Unhappy' }, { name: 'Total Neutral ' }, { name: 'ARR' }, { name: 'Industry' }, { name: '# Employees' }],
          (() => {
            return (
              data?.pretaaAdminGetCompanyRatingsByTotal?.map((r) => {
                return [r.name, r.happy, r.unhappy, r.neutral, r.arr, r.sectors, r.employees];
              }) || []
            );
          })()
        )
        // PDF done
        .addHeader('Launches', 2)
        .addTable(
          'launches',
          [{ name: 'Title' }, { name: 'Total for All Users' }, { name: 'Average Per User' }],
          (() => {
            return data.pretaaAdminGetLaunches.map((r) => {
              return [r.title, r.totalCount, r.averageCount];
            });
          })()
        )

        // PDF done

        .addHeader('Top 50 Launches by Company', 2)
        .addTable(
          'top50Launches',
          (() => {
            const columns: any = [];
            if (data.pretaaAdminGetTopLaunches && data.pretaaAdminGetTopLaunches.length) {
              const d: any = data.pretaaAdminGetTopLaunches[0];
              Object.keys(d).forEach((key) => {
                columns.push({ name: key });
              });
            }
            
            return columns;
          })(),
          (() => {
            if (data.pretaaAdminGetTopLaunches && data.pretaaAdminGetTopLaunches.length > 0) {
              return data.pretaaAdminGetTopLaunches.map((r: any) => {
                const rows: any = [];
                Object.keys(r).forEach((k) => {
                  rows.push(r[k]);
                });
                return rows;
              });
            } else {
              return [];
            }
          })()
        )

        // PDF done
        .addHeader('Hustle Hints', 2)
        .addTable(
          'hustleHints',
          [{ name: 'Title' }, { name: 'Total Acted Upon by All Users' }, { name: 'Average Acted Upon Per User' }],
          (() => {
            return data.pretaaAdminGetHustleHints.map((r) => {
              return [r.title, r.totalCount, r.averageCount];
            });
          })()
        )

        // PDF done
        .addHeader('Top 50 Hustle Hints by Company', 2)
        .addTable(
          'top50Hints',
          (() => {
            const columns: any = [];
            if (data.pretaaAdminGetTopHustleHints && data.pretaaAdminGetTopHustleHints.length > 0) {
              const d: any = data.pretaaAdminGetTopHustleHints[0];
              Object.keys(d).forEach((key) => {
                columns.push({ name: key });
              });
            }
            
            return columns;
          })(),
          (() => {
            if (data?.pretaaAdminGetTopHustleHints && data.pretaaAdminGetTopHustleHints.length > 0) {
              return data.pretaaAdminGetTopHustleHints?.map((r: any) => {
                const rows: any = [];
                Object.keys(r).forEach((k) => {
                  rows.push(r[k]);
                });
                return rows;
              });
            } else {
              return [];
            }
            
          })()
        );

      setTimeout(() => {
        resolve(true);
        const fileName = dayjs(new Date()).format('MM-DD-YYYY-hh-mm-ss');
        excelData.exportExcel(fileName);
      }, 5000);
    } else if (data && variables.type === 'pdf') {
      console.log('Creating PDF');

      PdfPrinter.fonts = {
        // download default Roboto font from cdnjs.com
        Roboto: {
          normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
          bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
          italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
          bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
        },
      };

      const pdfDefinition: TDocumentDefinitions = {
        pageSize: {
          width: 1920,
          height: 1080,
        },
        content: [
          { text: `Client Name: ${data.pretaaAdminGetCustomer?.name || ''}`, fontSize: 32 },
          {
            text: 'Client Summary', fontSize: 32, margin: [0, 30, 0, 10]
          },
          {
            table: {
              body: (()=> {
                const headers = ['Department', 'Total Employees', 'Total Logins', 'Number of Feedback Responses', 'Average Number of Stars'];
                const rows: Array<any> = data.pretaaAdminGetClientSummary.data.map((r: any) => {
                  return [r.department || 'NA', r.num_of_employees, r.num_of_logins, r.total_feedbacks, r.avg_stars];
                });
                
                return [headers].concat(rows);
              })(),
            }
          },

          {
            text: 'Companies', fontSize: 32, margin: [0, 30, 0, 10]
          },
          {
            table: {
              body: (()=> {
                const headers = [
                  'Total Companies Matched Across All Source Systems', 'Total Companies in CRM',
                  'Total Companies in CSM', 'Total Companies in Marketing',
                  'Average Company Views Per User', 'Average Prospect Views Per User',
                  'Average Customer Views Per User'];
                const rows: Array<any> = [];
                  const d = data.pretaaAdminGetCompaniesBySource;
                  if (d) {
                    const dt = [d.total, d.totalInCrm, d.totalCsm,
                      d.totalInMarketing, d.avgCompanyViews, d.avgProspectViews, d.avgCustomerViews];
                    rows.push(dt);
                  }
                
                return [headers].concat(rows);
              })(),
            }
          },

          {
            text: 'Company Filters - General', fontSize: 32, margin: [0, 30, 0, 10]
          },
          {
            table: {
              body: (() => {
                const headers = ['Title', 'Count of Filters Including this Criterion', 
                'Percent of All Filtering That Includes This Criterion'];
                const rows: Array<any> = [];
                  const d = data.pretaaAdminGetCompanyFilters;
                  const dt = [
                    ['Starred', d?.filterCounts.starred, d?.percentages.starred],
                    ['Customers', d?.filterCounts.customer, d?.percentages.customer],
                    ['Prospect', d?.filterCounts.prospect, d?.percentages.prospect],
                    ['Reference - Manual', d?.filterCounts.reference_manual, d?.percentages.reference_manual],
                    ['Reference - Manual - Has Served', d?.filterCounts.has_served, d?.percentages.has_served],
                    ['Reference - Manual - Have Offered', d?.filterCounts.has_offered, d?.percentages.has_offered],
                    ['Reference - Surveyed', d?.filterCounts.surveyed, d?.percentages.surveyed],
                    ['NPS Score', d?.filterCounts.nps_score, d?.percentages.nps_score],
                    ['Industry', d?.filterCounts.industry, d?.percentages.industry],
                    ['ARR', d?.filterCounts.arr, d?.percentages.arr],
                    ['Seats', d?.filterCounts.employee_seats, d?.percentages.employee_seats],
                    ['Products', d?.filterCounts.product, d?.percentages.product],
                  ];
                  dt.forEach((item: any) => {
                    rows.push(item);
                  });
                  
                return [headers].concat(rows);
              })()
            },
          },

          {
            text: 'Company Filters - Product', fontSize: 32, margin: [0, 30, 0, 10]
          },
          {
            table: {
              body: (() => {
                const headers = ['Product', 'Number of Times Filters Included This'];
                const rows: Array<any> = data.pretaaAdminGetCompanyFilterProduct?.map((r) => {
                  return [r.product, r.searchedCount];
                });
                
                return [headers].concat(rows);
              })()
            },
          },

          {
            text: 'Company Filters - Industry', fontSize: 32, margin: [0, 30, 0, 10]
          },
          {
            table: {
              body: (() => {
                const headers = ['Industry', 'Number of Times Filters Included This'];
                const rows: Array<any> = data.pretaaAdminGetCompanyFilterIndustry?.map((r) => {
                  return [r.industry, r.searchedCount];
                });
                
                return [headers].concat(rows);
              })()
            },
          },

          {
            text: 'Events', fontSize: 32, margin: [0, 30, 0, 10]
          },
          {
            table: {
              body: (() => {
                const headers = ['Total Events Generated', 'Average Events Generated Per User', 'Total Event Details Views', 'Average Event Detail Views Per User'];

                const rows: Array<any> = [];
                  const d = data.pretaaAdminGetEventsReport;
                  if (d) {
                    const dt = [d.total_generated, d.avg_generated, d.total_details_views,
                      d.avg_details_views];
                    rows.push(dt);
                  }
                
                return [headers].concat(rows);
              })()
            },
          },

          {
            text: 'Top 50 Most Common Event Search Terms', fontSize: 32, margin: [0, 30, 0, 10]
          },
          {
            table: {
              body: (() => {
                const headers = ['Search Term', 'Number of Searches'];
                const rows: Array<any> = data.pretaaAdminGetTopEventSearchTerms?.map((r) => {
                  return [r.search_text, r.search_count];
                });
                
                return [headers].concat(rows);
              })()
            },
          },

          {
            text: 'Event Filters - General', fontSize: 32, margin: [0, 30, 0, 10]
          },
          {
            table: {
              body: (() => {
                const headers = ['Label', 'Percent of All Filtering That Includes This Criterion'];
                  const d = _.cloneDeep(data?.pretaaAdminGetEventFilters?.percentages) as any;
                  delete d.__typename;
                  const tableRows = [
                    'Company Rating',
                    'Contact Change',
                    'Hidden',
                    'In the news',
                    'Launch',
                    'My Companies',
                    'Needs Attention',
                    'Onboarding',
                    'Performance',
                    'Pipeline',
                    'Potential Reference',
                    'Product',
                    'Renewal',
                    'Revenue Change',
                    'Stared',
                    'Support',
                    'Total Searched',
                  ];
                  const rows = Object.keys(d).map((key: string, index: number) => {
                    return [tableRows[index], String(d[key])];
                  });
                  return [headers].concat(rows);
              })()
            },
          },

          { text: 'References Given By Users', fontSize: 32, margin: [0, 30, 0, 10] },
          { text: `Total Count: ${String(data.pretaaAdminReferencesGivenByUsers?.counts) || '0' }`, fontSize: 16, margin: [0, 10, 0, 10] },
          { text: `Distinct Types Given (Comma Delimited):
          ${data.pretaaAdminReferencesGivenByUsers?.commaDelimitedTypes || ''}`, fontSize: 16, margin: [0, 10, 0, 10] },
          {
            table: {
              body: (() => {
                const headers = ['User Who Entered Reference', 'Action (Add/Delete)', 'Date/Time of Entry', 'Company', 'Types Given (Comma Delimited)',
              'ARR', 'Industry', '# Employees'];
                let rows: Array<any> = [];
                rows = (data.pretaaAdminReferencesGivenByUsers?.references?.map((r) => {
                  return [
                    r.user?.email,
                    `${r.isDeleted ? 'Delete' : 'Add'}`,
                    r.createdAt,
                    r.company.name,
                    r.offerOptions.map((o) => o.offerOption.offerType).join(),
                    r.company.annualRecurringRevenueVal?.data || '',
                    r.company.companyIndustries.map((i) => i.industry.sector).join(','),
                    r.company.employeeCount,
                  ];
                }) || []);

                return [headers].concat(rows);
              })()
            }
          },

          { text: 'References Given By Company', fontSize: 32, margin: [0, 30, 0, 10] },
          { text: `Total Count: ${String(data.pretaaAdminReferencesGivenByCompanies?.counts || '') }`, fontSize: 16, margin: [0, 10, 0, 10] },
          { text: `Distinct Types Given (Comma Delimited):
          ${String(data.pretaaAdminReferencesGivenByCompanies?.commaDelimitedTypes || '')}`, fontSize: 16, margin: [0, 10, 0, 10] },
          {
            table: {
              body: (() => {
                const headers = ['Company', 'Total', 'Types Given (Comma Delimited)', 'ARR', 'Industry', '# Employees'];
                let rows: Array<any> = [];
                if (data?.pretaaAdminReferencesGivenByCompanies?.reference) {
                  rows = data?.pretaaAdminReferencesGivenByCompanies?.reference.map((r) => {
                    return [r.name, r.total, String(r.arr), r.arr, r.sectors, String(r.employees)];
                  });
                }
                return [headers].concat(rows);
              })()
            }
          },

          { text: 'Willing Reference', fontSize: 32,  margin: [0, 30, 0, 10] },
          { text: `Total Count: ${String(data?.pretaaAdminWillingReferencesByCompany?.counts?.count) }`, fontSize: 16, margin: [0, 10, 0, 10] },
          { text: `Distinct Types Given (Comma Delimited):
          ${String(data?.pretaaAdminWillingReferencesByCompany?.counts?.allOfferTypesList)}`, fontSize: 16, margin: [0, 10, 0, 10] },
          {
            table: {
              body: (() => {
                const headers = ['Company', 'Types (Comma Delimited)', 'ARR', 'Industry', '# Employees'];
                let rows: Array<any> = [];
                if (data?.pretaaAdminWillingReferencesByCompany?.companies) {
                  rows = data?.pretaaAdminWillingReferencesByCompany?.companies.map((r) => {
                    return [r.name, r.offerTypesList, r.annualRecurringRevenue, r.sectorList, r.employeeCount];
                  });
                }
                return [headers].concat(rows);
              })()
            }
          },

          {
            text: 'Top 10 Ratings by ARR', fontSize: 32, margin: [0, 30, 0, 10]
          },
          {
            table: {
              body: (() => {
                const headers = ['Company', 'Total Happy', 'Total Unhappy', 'Total Neutral', 'ARR', 'Industry', 'Employees' ];
                const rows: Array<any> = data.pretaaAdminGetCompanyRatingsByARR?.map((r) => {
                  return [r.name, r.happy, r.unhappy, r.neutral, r.arr, r.sectors, r.employees];
                }) || [];
                
                return [headers].concat(rows);
              })()
            },
          },
       
          {
            text: 'Top 10 Ratings by Total Ratings', fontSize: 32, margin: [0, 30, 0, 10]
          },
          {
            table: {
              body: (() => {
                const headers = ['Company', 'Total Happy', 'Total Unhappy', 'Total Neutral', 'ARR', 'Industry', 'Employees' ];
                const rows: Array<any> = data.pretaaAdminGetCompanyRatingsByTotal?.map((r) => {
                  return [r.name, r.happy, r.unhappy, r.neutral, r.arr, r.sectors, r.employees];
                }) || [];
                
                return [headers].concat(rows);
              })()
            },
          },

          {
            text: 'Launches', fontSize: 32, margin: [0, 30, 0, 10]
          },
          {
            table: {
              body: (() => {
                const headers = ['Title', 'Total for All Users', 'Average Per User'];
                const rows: Array<any> = data.pretaaAdminGetLaunches.map((r) => {
                  return [r.title, r.totalCount, r.averageCount];
                });
                
                return [headers].concat(rows);
              })()
            },
          },

          {
            text: 'Top 50 Launches by Company', fontSize: 32, margin: [0, 30, 0, 10]
          },
          {
            table: {
              body: (() => {
                const headers = Object.keys(data.pretaaAdminGetTopLaunches[0]);
                const rows: Array<any> = [];
               
                data.pretaaAdminGetTopLaunches.forEach((r: any) => {
                  const row: Array<any> = [];
                  Object.keys(r).forEach((k) => {
                    row.push(r[k] ? r[k] : '');
                  });
                  rows.push(row);
                });
              
                return [headers].concat(rows);
              })()
            },
          },

          {
            text: 'Hustle Hints', fontSize: 32, margin: [0, 30, 0, 10]
          },
          {
            table: {
              body: (() => {
                const headers = ['Title', 'Total Acted Upon by All Users', 'Average Acted Upon Per User' ];
                const rows: Array<any> =  data.pretaaAdminGetHustleHints.map((r) => {
                  return [r.title, r.totalCount, r.averageCount];
                });
               
              
                return [headers].concat(rows);
              })(),
            },
          },

          {
            text: 'Top 50 Hustle Hints by Company', fontSize: 32, margin: [0, 30, 0, 10]
          },
          {
            table: {
              body: (() => {
                const d = data.pretaaAdminGetTopHustleHints[0];
                const headers = d ? Object.keys(d) : [];
                const rows: Array<any> = [];
               
                data.pretaaAdminGetTopHustleHints.forEach((r: any) => {
                  const row: Array<any> = [];
                  Object.keys(r).forEach((k, index: number) => {
                    if (index <= headers.length - 1) {
                      row.push(r[k]);
                    }
                  });
                  rows.push(row);
                });
                
                return [headers].concat(rows);
              })(),
            },
          },
          
        ],

        defaultStyle: {
          font: 'Roboto',
        },
      };

      try {
        resolve(true);
        const fileName = dayjs(new Date()).format('MM-DD-YYYY-hh-mm-ss');
        PdfPrinter.createPdf(pdfDefinition).download(`${fileName}.pdf`);
      } catch (e) {
        console.log(e);
        reject(true);
      }
    }
  });
}
