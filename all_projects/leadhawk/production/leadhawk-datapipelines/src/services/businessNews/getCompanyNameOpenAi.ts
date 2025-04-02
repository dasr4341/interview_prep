import OpenAI from "openai";
import { Logger } from "winston";
import { ChatGPTNewsModel } from "../../models/chatGPTNewsModel.js";
import { getUTF8Data } from "../../helper/encodeUTF-8String.js";

const openai = new OpenAI();

interface IChatGPTBusinessNewsExtractor {
  companyName: string | null;
}

export async function getCompanyNameOpenAi(text: string, logger: Logger) {
  const gptLogger = logger.child({
    subservice: "ChatGPT::Business_News",
  });

  const cachedResult = await ChatGPTNewsModel.findOne({
    Text: text,
  }).lean();

  if (cachedResult) {
    logger.info("ChatGPT BusinessNews Cache Hit");
    if (!cachedResult.result) {
      return null;
    }
    return cachedResult.result.companyName || null;
  }

  const prompt = `
    Extract the company name from the following article Text.
    If you find the company name, return it as a JSON object with the key "companyName", shown in Example 1.
    If you are unable to find the company name for the Text, then return null, as shown in Example 3.
    If there are two company name, pick the who is the organizing the event, as shown in Example 4.
    If there are two company name, the company being acquired is going to become the company that acquired it so the company reps care about it is the company that is acquiring, as shown in Example 5.
      
    Example 1:
    Input: "Blue Earth Therapeutics Ltd Announces Expansion of Partnership With Seibersdorf Labor GmbH to Include Manufacture of Therapeutic Radiopharmaceutical, 225Ac-rhPSMA-10.1. OXFORD, England--(BUSINESS WIRE)--Blue Earth Therapeutics Ltd, a Bracco company and emerging leader in the development of innovative next generation therapeutic radiopharmaceuticals, today announced an expansion of its manufacturing agreements with Seibersdorf Labor GmbH to include manufacture of its investigational 225Ac-based radioligand therapy. The agreement provides future supply to UK, EU and US clinical trial sites. (225Ac) rhPSMA‐10.1, an investigational radiohybrid (rh) Prostate‐Specif"
    {"companyName": "Blue Earth Therapeutics"}

    Example 2:
    Input: "Autonomy, the leading EV subscription company, announces it is pivoting from vehicle subscriptions to launch a new SaaS business, Autonomy Data Services (ADS), in partnership with Deloitte. SANTA MONICA, Calif.--(BUSINESS WIRE)--Autonomy, the leading EV subscription company, announces it is pivoting from vehicle subscriptions to launch a new SaaS business, Autonomy Data Services (ADS), in partnership with Deloitte."
    {"companyName": "Autonomy"}

    Example 3:
    Input: "06:00 ET LA SUPERSTAR MONDIALE ARIANA GRANDE, EN PARTENARIAT AVEC LUXE BRANDS, PORTE SON PORTEFEUILLE DE PARFUMS À UN NIVEAU SUPÉRIEUR AVEC LOVENOTES, UNE COLLECTION EXCLUSIVE ET PERSONNALISÉE. La chanteuse, compositrice et actrice Ariana Grande, lauréate d'un Grammy, est prête à captiver le monde une fois de plus avec le lancement..."
    {"companyName": null}

    Example 4:
    Input: "Nobl Q Expands its AI and Digital Solutions Offerings and Strengthens Client Impact with Strategic Acquisition of Propel"
    {"companyName": "Nobl Q"}

    Example 5:
    Input: "Iteris to Be Acquired by Almaviva for $335 Million"
    {"companyName": "Almaviva"}

    Text: ${text
      .replaceAll("-", "")
      .trim()
      .replaceAll('"', "")
      .replaceAll("{", "")
      .replaceAll("}", "")}
  `;

  try {
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt,
      max_tokens: 50,
      temperature: 0,
    });
    const stringResult = response.choices[0].text;

    if (stringResult !== "null") {
      const result = JSON.parse(
        getUTF8Data(stringResult)
      ) as IChatGPTBusinessNewsExtractor;

      await ChatGPTNewsModel.findOneAndUpdate(
        {
          Text: text,
        },
        {
          Text: text,
          result,
        },
        { upsert: true, new: true }
      );
      return result.companyName || null;
    }

    await ChatGPTNewsModel.findOneAndUpdate(
      {
        Text: text,
      },
      { Text: text, result: null },
      { upsert: true, new: true }
    );

    return null;
  } catch (error) {
    gptLogger.error(`Chat GPT error on prompt: ${text}`, error);
    return null;
  }
}
