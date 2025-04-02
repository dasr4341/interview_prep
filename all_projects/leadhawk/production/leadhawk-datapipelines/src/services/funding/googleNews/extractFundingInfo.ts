import OpenAI from "openai";
import type { Logger } from "winston";
import { ChatGPTFundingModel } from "../../../models/chatGPTFundingModel.js";
import { getUTF8Data } from "../../../helper/encodeUTF-8String.js";

const openai = new OpenAI();

interface ChatGPTFundingExtractor {
  companyName: string | null;
  fundingRaised: number | null;
}

export async function extractFundingInfo(
  text: string,
  logger: Logger
): Promise<ChatGPTFundingExtractor | null> {
  const gptLogger = logger.child({
    subservice: "ChatGPT",
  });

  const cachedResult = await ChatGPTFundingModel.findOne({
    Text: text,
  }).lean();

  if (cachedResult) {
    logger.info("ChatGPT Cache Hit");
    if (!cachedResult.result) {
      return null;
    }
    return {
      companyName: cachedResult.result.companyName || null,
      fundingRaised: cachedResult.result.fundingRaised || null,
    };
  }

  const prompt = `
    Extract the company name and funding raised in numbers from the following text.
    If the text does not contain both a company name and a funding amount, respond with "null" only, else give JSON structure like in examples.
    If the text talks about multiple funding, respond with "null" only. Like in Example 4
    If the text talks about any place that is outside United States, respond with "null" only. Like in Example 5, Barcelona is outside US
    If the text has inconclusive company name like in Example 5, respond with "null" only.
    If the text looks like a person name like in Example 8, respond with "null" only. You can be leniant for this rule. If you are unsure to determine company name with person name, you should respond with the JSON structure. Only if you are very sure, you should give null value. Like in Examples 10 and 11, although there are people's name, the company name is clear.
    In cases like Example 10 and 11. There are high chances that the company name is 'W' instead of 'Jake Paul's W'

    Format the response as a JSON object with the following structure: {"companyName": string, "fundingRaised": number}


    Example 1:
    Input: Headway raises $100 mln in funding at $2.3 bln valuation
    {"companyName": "Headway", "fundingRaised": 100000000}

    Example 2:
    Input: QA Wolf raises $36M in fresh funding to ease application reliability testing
    {"companyName": "QA Wolf", "fundingRaised": 36000000}

    Example 3:
    Input: Harris donations top $100m after Biden's exit from presidential race
    null

    Example 4:
    Input: The Week's 10 Biggest Funding Rounds: Cardurion Pharmaceuticals And Human Interest Nab Largest Raises
    null

    Example 5:
    Input: Barcelona-based Payflow raises €6 million to expand flexible salary in Iberian and Latam markets
    null

    Example 6:
    Input: Startup led by former J&J executives raises $165M for cancer, immune disease drugs
    null

    Example 7:
    Input: Life Sciences Asset Manager Soleus Raises Its First Private Credit Fund
    {"companyName": "Soleus", "fundingRaised": 0}

    Example 8:
    Input: Kamala Harris raises $50 million on first day of campaign, inciting what 'might be the greatest fundraising moment in Democratic Party history'
    null

    Example 9:
    Input: Life Sciences Asset Manager Soleus Raises Its First Private Credit Fund
    {"companyName": "Soleus", "fundingRaised": 0}

    Example 10:
    Input: Jake Paul's W Raises $14 Million in Seed and Series A Funding Led by Shrug Capital and Anti Fund to Reinvigorate Men's Personal Care Aisle
    {"companyName": "W", "fundingRaised": 14000000}

    Example 10:
    Input: Jake Paul's W Raises $14M From Paris Hilton, Naomi Osaka, Lil Durk and Fanatics' Michael Rubin
    {"companyName": "W", "fundingRaised": 14000000}

    Text: ${text}
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
      try {
        let result = JSON.parse(getUTF8Data(stringResult));
        result = {
          ...result,
          fundingRaised: !Number.isNaN(Number(result?.fundingRaised))
            ? Number(result.fundingRaised)
            : null,
        };
        await ChatGPTFundingModel.findOneAndUpdate(
          {
            Text: text,
          },
          {
            Text: text,
            result,
          },
          { upsert: true, new: true }
        );
        return result;
      } catch (e) {
        console.log("got errror", e);
        return null;
      }
    }

    await ChatGPTFundingModel.findOneAndUpdate(
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
