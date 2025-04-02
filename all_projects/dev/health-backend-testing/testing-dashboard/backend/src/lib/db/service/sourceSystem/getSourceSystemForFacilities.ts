import { EnvironmentList } from '../../../../config/config.enum';
import { getRemoteData } from '../../dbInstance';

export const getSourceSystemForFacilities = async (facilityId: string, dbInstance: EnvironmentList) => {
  const queryText = `
    SELECT
    src.name,
    src.value,
    fa.id,
    fa.name as facilityname
    FROM public.facilities as fa
    INNER JOIN public.source_system_values as src
    ON fa.id  = src.facility_id
    WHERE fa.id = $1
  `;
  try {
    const query = {
      text: queryText,
      values: [facilityId],
    };
    return await getRemoteData({ query, dbInstance });
  } catch (e) {
    throw e;
  }
};
