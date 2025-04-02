import { SurveyPatientStats } from './SurveyStatsModal';

export const ScoreColumnStats = ({ data }: { data: SurveyPatientStats }) => {
  if (data.bamScore) {
    return (
      <div className="py-3 leading-none">
        <div>
          <span className="font-semibold ">Use Factors: {'  '} </span>
          {data.bamScore.useFactors},
        </div>
        <div className="py-2">
          <span className="font-semibold ">Risk Factors:</span> {data.bamScore.riskFactors},
        </div>
        <div>
          <span className="font-semibold ">Protective Factors:</span> {data.bamScore.protectiveFactors}
        </div>
      </div>
    );
  } else if (data.overAllPatientScore !== null ) {
    return <div>{data.overAllPatientScore}</div>;
  } else {
    return <div>N/A</div>;
  }
};
