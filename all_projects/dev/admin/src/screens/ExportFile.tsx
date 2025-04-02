import ExcelBuilder from 'lib/ExcelBuilder';


const ExportFile = () => {
  const clientName = 'Client: Banti Patel';

  const onClick = () => {
    const excelBuilder = new ExcelBuilder();
    excelBuilder
      .createWorkSheet('sheet')
      .addHeader('Client Summary', 7, clientName)
      .addTable(
        'clientSummary',
        [
          { name: 'Department', totalsRowLabel: 'Grand Total' },
          { name: 'Total Employees', totalsRowFunction: 'sum' },
          { name: 'Total Logins', totalsRowFunction: 'sum' },
          {
            name: 'Average Number of People Using Pretaa Per Day',
            totalsRowFunction: 'average',
            meta: { background: 'FFFFD7D7' },
          },
          {
            name: 'Average Number of Actions in Pretaa App Per Day',
            totalsRowFunction: 'average',
            meta: { background: 'FFFFD7D7' },
          },
          { name: 'Number of Feedback Responses', totalsRowFunction: 'sum' },
          { name: 'Average Number of Stars', totalsRowFunction: 'sum' },
        ],
        [
          ['Department 1', 12, 2, 34, 1, 3, 54],
          ['Department 2', 23, 3, 56, 2, 4, 45],
          ['Department 3', 34, 4, 45, 3, 5, 34],
          ['Department 4', 45, 5, 67, 4, 6, 23],
        ]
      )
      .addHeader('Companies', 7, clientName)
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
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3, 4, 5, 6, 7],
        ]
      )
      .addHeader('Company Filters - General', 3, clientName)
      .addTable(
        'companyFiltersGeneral',
        [
          { name: ' ' },
          { name: 'Count of Filters Including this Criterion' },
          { name: 'Percent of All Filtering That Includes This Criterion' },
        ],
        [
          ['Starred', 1, 2],
          ['Customers', 1, 2],
          ['Prospect', 1, 2],
          ['Reference - Manual', 1, 2],
          ['Reference - Manual - Has Served', 1, 2],
          ['Reference - Manual - Have Offered', 1, 2],
          ['Reference - Surveyed', 1, 2],
          ['NPS Score', 1, 2],
          ['Industry', 1, 2],
          ['ARR', 1, 2],
          ['Seats', 1, 2],
          ['Product', 1, 2],
        ],
        true
      )
      .addHeader('Company Filters - Product', 2, clientName)
      .addTable(
        'companyFiltersProduct',
        [{ name: 'Product' }, { name: 'Number of Times Filters Included This' }],
        [
          ['Product', 1],
          ['Product', 2],
          ['Product', 3],
          ['Product', 4],
          ['Product', 5],
        ]
      )
      .addHeader('Company Filters - Industry', 2, clientName)
      .addTable(
        'companyFiltersIndustry',
        [{ name: 'Industry' }, { name: 'Number of Times Filters Included This' }],
        [
          ['Industry', 1],
          ['Industry', 2],
          ['Industry', 3],
          ['Industry', 4],
          ['Industry', 5],
        ]
      )
      .addHeader('Company Filters - Popular Criterion Combinations', 2, clientName, undefined, 'FFFFD7D7')
      .addTable(
        'companyFiltersPopularCriterionCombinations',
        [
          { name: 'Filters Used', meta: { background: 'FFFFD7D7' } },
          { name: 'Percent of All Filtering', meta: { background: 'FFFFD7D7' } },
        ],
        [
          ['e.g., Starred, Customer', 1],
          ['1 or More Industries, 1 or More Products', 2],
          ['Customer, Prospect, 1 or More Products', 3],
        ]
      )
      .addHeader('Events', 4, clientName)
      .addTable(
        'companyFiltersIndustry',
        [
          { name: 'Total Events Generated' },
          { name: 'Average Events Generated Per User' },
          { name: 'Total Event Details Views' },
          { name: 'Average Event Detail Views Per User' },
        ],
        [
          [1, 2, 3, 4],
          [1, 2, 3, 4],
          [1, 2, 3, 4],
          [1, 2, 3, 4],
        ]
      )
      .addHeader('Top 50 Most Common Event Search Terms', 2, clientName)
      .addTable(
        'mostCommonEvent',
        [{ name: 'Search Term' }, { name: 'Number of Searches' }],
        [
          ['Test', 1],
          ['Test', 2],
          ['Test', 3],
          ['Test', 4],
        ]
      )
      .addHeader('Event Filters - General', 2, clientName)
      .addTable(
        'eventFiltersGeneral',
        [{ name: ' ' }, { name: 'Percent of All Filtering That Includes This Criterion' }],
        [
          ['Product Health', 1],
          ['Product News', 2],
          ['Prospect News', 3],
          ['Prospect Health', 4],
          ['Customer News', 5],
          ['Customer Health', 6],
          ['Launched', 7],
          ['Reference', 8],
          ['Notes', 9],
          ['Starred', 10],
          ['Needs Attention', 11],
          ['Ratings', 12],
          ['Hidden', 13],
        ],
        true
      )
      .addHeader('Event Filters - Popular Criterion Combinations', 2, clientName, undefined, 'FFFFD7D7')
      .addTable(
        'eventFiltersPopularCriterionCombinations',
        [
          { name: 'Filters Used', meta: { background: 'FFFFD7D7' } },
          { name: 'Percent of All Filtering', meta: { background: 'FFFFD7D7' } },
        ],
        [
          ['e.g., Product Health, Launched', 1],
          ['Ratings', 2],
          ['Needs Attention', 3],
        ]
      )
      .addHeader('References Given', 8, clientName, [
        { label: 'TotalCount', value: '10' },
        { label: 'Distinct Types Given (Comma Delimited)', value: '99' },
      ])
      .addTable(
        'referencesGiven',
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
          [1, 2, 3, 4, 5, 6, 7, 8],
          [1, 2, 3, 4, 5, 6, 7, 8],
          [1, 2, 3, 4, 5, 6, 7, 8],
          [1, 2, 3, 4, 5, 6, 7, 8],
          [1, 2, 3, 4, 5, 6, 7, 8],
        ]
      )
      .addHeader('References Given', 6, clientName, [
        { label: 'TotalCount', value: '10' },
        { label: 'Distinct Types Given (Comma Delimited)', value: '99' },
      ])
      .addTable(
        'referencesGiven2',
        [
          { name: 'Company' },
          { name: 'Total' },
          { name: 'Types Given (Comma Delimited)' },
          { name: 'ARR' },
          { name: 'Industry' },
          { name: '# Employees' },
        ],
        [
          [1, 2, 3, 4, 5, 6],
          [1, 2, 3, 4, 5, 6],
          [1, 2, 3, 4, 5, 6],
          [1, 2, 3, 4, 5, 6],
          [1, 2, 3, 4, 5, 6],
        ]
      )
      .addHeader('Willing References', 5, clientName, [
        { label: 'TotalCount', value: '10' },
        { label: 'Distinct Types Given (Comma Delimited)', value: '99' },
      ])
      .addTable(
        'willingReferences',
        [
          { name: 'Company' },
          { name: 'Types (Comma Delimited)' },
          { name: 'ARR' },
          { name: 'Industry' },
          { name: '# Employees' },
        ],
        [
          ['A', 'B', 'C', 'D', 'E'],
          ['A', 'B', 'C', 'D', 'E'],
          ['A', 'B', 'C', 'D', 'E'],
          ['A', 'B', 'C', 'D', 'E'],
        ]
      )
      .addHeader('Ratings', 8, clientName)
      .addTable(
        'ratings',
        [
          { name: 'Company' },
          { name: 'Total Ratings Reported' },
          { name: 'Total Positive' },
          { name: 'Total Neutral' },
          { name: 'Total Negative' },
          { name: 'ARR' },
          { name: 'Industry' },
          { name: '# Employees' },
        ],
        [
          ['A', 'B', 'C', 'D', 1, 2, 3, 4],
          ['A', 'B', 'C', 'D', 1, 2, 3, 4],
          ['A', 'B', 'C', 'D', 1, 2, 3, 4],
          ['A', 'B', 'C', 'D', 1, 2, 3, 4],
        ]
      )
      .addHeader('Launches', 3, clientName)
      .addTable(
        'launches',
        [
          { name: ' ', meta: { background: 'FFCCCCCC' } },
          { name: 'Total for All Users' },
          { name: 'Average Per User' },
        ],
        [
          ['All', 1, 2],
          ['For Delayed Customer Onboarding - CS', 1, 2],
          ['For Delayed Customer Onboarding - Customer', 1, 2],
          ['For POC Position Changed', 1, 2],
          ['For Stuck in pipeline stage', 1, 2],
          ['For Potential Reference Customer (NPS Score)', 1, 2],
          ['For Great time for Upsell', 1, 2],
        ],
        true
      )
      .addHeader('Top 50 Launches by Company', 8, clientName)
      .addTable(
        'launchesByCompany',
        [
          { name: 'Company' },
          { name: 'All' },
          { name: 'For Delayed Customer Onboarding - CS' },
          { name: 'For Delayed Customer Onboarding - Customer' },
          { name: 'For POC Position Changed' },
          { name: 'For Stuck in pipeline stage' },
          { name: 'For Potential Reference Customer (NPS Score)' },
          { name: 'For Great time for Upsell ' },
        ],
        [
          ['A', 'B', 'C', 'D', 1, 2, 3, 4],
          ['A', 'B', 'C', 'D', 1, 2, 3, 4],
          ['A', 'B', 'C', 'D', 1, 2, 3, 4],
          ['A', 'B', 'C', 'D', 1, 2, 3, 4],
        ]
      )
      .addHeader('Hustle Hints', 3, clientName)
      .addTable(
        'hustleHints',
        [
          { name: ' ', meta: { background: 'FFCCCCCC' } },
          { name: 'Total Acted Upon by All Users' },
          { name: 'Average Acted Upon Per User' },
        ],
        [
          ['All', 1, 2],
          ['For Delayed Customer Onboarding', 1, 2],
          ['For POC Position Changed', 1, 2],
          ['For Stuck in pipeline stage', 1, 2],
          ['For Potential Reference Customer (NPS Score)', 1, 2],
          ['For Great time for Upsell ', 1, 2],
        ],
        true
      )
      .addHeader('Top 50 Hustle Hints by Company', 7, clientName)
      .addTable(
        'hustleHintsByCompany',
        [
          { name: 'Company' },
          { name: 'All' },
          { name: 'For Delayed Customer Onboarding' },
          { name: 'For POC Position Changed' },
          { name: 'For Stuck in pipeline stage' },
          { name: 'For Potential Reference Customer (NPS Score)' },
          { name: 'For Great time for Upsell ' },
        ],
        [
          ['A', 'B', 'C', 'D', 1, 2, 3],
          ['A', 'B', 'C', 'D', 1, 2, 3],
          ['A', 'B', 'C', 'D', 1, 2, 3],
          ['A', 'B', 'C', 'D', 1, 2, 3],
        ]
      )
      .exportExcel('test_builder.xlsx');
  };

  return <button onClick={() => onClick()}>Export file</button>;
};

export default ExportFile;
