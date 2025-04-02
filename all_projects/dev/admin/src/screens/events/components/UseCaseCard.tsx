import React from 'react';
import HighCsatScore from './HighCsatScore';
import InTheNews from './InTheNews';
import LowCsatScore from './LowCsatScore';
import LowNPSScore from './LowNPSScore';
import PossibleReferenceCustomerNPS from './PossibleReferenceCustomerNPS';
import ProductInstanceSetupDelayed from './ProductInstanceSetupDelayed';
import StuckSalesOpportunitiesStage from './StuckSalesOpportunitiesStage';

export default function UseCaseCard({ name, data }: { name: string; data: any }) {
  if (name.includes('stuck_sales_opportunities_stage')) {
    return (
      <StuckSalesOpportunitiesStage
        avgDaysInStageAcross={data.avgDaysInStageAcross}
        percentAboveNormal={data.percentAboveNormal}
        daysSincePurchase={data.daysSincePurchase}
        lastTouchpoint={data.lastTouchpoint}
      />
    );
  } else {
    switch (name) {
      case 'possible_reference_customer_nps':
        return (
          <PossibleReferenceCustomerNPS
            surveyResults={data.surveyResults}
            dateSubmitted={data.dateSubmitted}
            surveyRespondent={data.surveyRespondent}
            surveyCompany={data.surveyCompany}
            surveyEmail={data.surveyEmail}
          />
        );
      case 'low_nps_score':
        return <LowNPSScore npsScore={data.npsScore} customer={data.customer} variable={data.variable1} />;
      case 'high_csat_score':
        return <HighCsatScore customer={data.customer} client={data.client} csatScore={data.csatScore} variable={data.variable1} />;
      case 'low_csat_score':
        return <LowCsatScore csatScore={data.csatScore} customer={data.customer} variable={data.variable1} client={data.client} />;
      case 'product_instance_setup_delayed':
        return (
          <ProductInstanceSetupDelayed
            avgDaysInStageAcross={data.avgDaysToBeOperational}
            percentAboveNormal={data.percentAboveNormal}
            daysSincePurchase={data.daysSincePurchase}
            lastTouchpoint={data.lastTouchpoint}
          />
        );

        case 'mna_news_prospect':
        case 'mna_news_customer':
        case 'mna_news_competitor':
          return <InTheNews data={data} />;

      default:
        return <></>;
    }
  }
}
