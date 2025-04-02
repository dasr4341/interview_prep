import { EnvironmentList } from '../../../../config/config.enum';
import { getRemoteData } from '../../dbInstance';

export const getSourceSystemFacilityList = async (sourceSystemType: string, dbInstance: EnvironmentList) => {
  const queryText = `
  SELECT 
  fa.id,
  fa.name as facilityname
  FROM public.facilities as fa INNER JOIN
  public.source_system_values as src
  ON fa.id  = src.facility_id
  LEFT JOIN source_systems as src1 ON src1.id = fa.source_system_id
  WHERE src1.slug = $1
  GROUP BY fa.id
  `;

  try {
    return await getRemoteData({ query: { text: queryText, values: [sourceSystemType] }, dbInstance });
  } catch (e) {
    throw e;
  }
};
