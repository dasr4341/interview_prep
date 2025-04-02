import { assetsIndustriesModel } from "../../models/assetIndustriesModel.js";

const IndustrySingleton: {
  industries: string[];
  mappedIndustries: Map<string, string>;
  getIndustry: () => Promise<void>;
} = {
  industries: [],
  mappedIndustries: new Map(),
  async getIndustry() {
    const industriesList$ = await assetsIndustriesModel.find({}).lean();

    this.industries = industriesList$.map((industry) => industry.key);
    industriesList$.forEach(
      ({ key: searchIndustry, value: relatedIndustries }) => {
        // biome-ignore lint/complexity/noForEach: <explanation>
        relatedIndustries.forEach((val: string) =>
          this.mappedIndustries.set(val, searchIndustry)
        );
      }
    );
  },
};

export default IndustrySingleton;
