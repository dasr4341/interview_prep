import { ComprehendClient, DetectEntitiesCommand, LanguageCode } from '@aws-sdk/client-comprehend';
import { config } from '../../config/config.js';
import { AWSComprehendModel } from '../../models/awsComprehendModel.js';
import type { Logger } from 'winston';

const comprehendClient = new ComprehendClient({
  region: config.aws.default_region,
});

export default async function getCompanyName(Text: string, logger: Logger) {
  const command = new DetectEntitiesCommand({
    Text,
    LanguageCode: LanguageCode.EN,
  });

  const cachedResult = await AWSComprehendModel.findOne({
    Text
  });
  if (cachedResult) {
    logger.info("Comprehend Cache Hit");
    return cachedResult.companyName || null;
  }

  try {
    const response = await comprehendClient.send(command);

    const organizations = response.Entities?.filter(
      (entity) => entity.Type === 'ORGANIZATION'
    );
    const companyName = organizations
      ?.filter(organization => !(/business\s?wire/i.test(organization.Text || '')))
      .reduce((a, b) =>
        (a.Score || 0) > (b.Score || 0) ? a : b, organizations[0]
      );

    await AWSComprehendModel.updateOne(
      { Text },
      {
        $set: {
          Text,
          companyName: companyName?.Text
        }
      },
      { upsert: true }
    );
    return companyName?.Text || null;
  } catch(e) {
    return '';
  }
}
