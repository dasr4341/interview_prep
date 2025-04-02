import { assetsJobTitleModel } from "../models/assetJobTitleModel.js";

const JobTitleSingleton: {
  jobTitles: string[];
  mappedJobTitles: Map<string, string>;
  getJobTitles: () => Promise<void>;
} = {
  jobTitles: [],
  mappedJobTitles: new Map(),
  async getJobTitles() {
    const jobTitlesList$ = await assetsJobTitleModel.find({}).lean();

    this.jobTitles = jobTitlesList$.map((titles) => titles.key);
    jobTitlesList$.forEach(({ key: searchTitle, value: relatedTitles }) => {
      relatedTitles.forEach((val: string) =>
        this.mappedJobTitles.set(val, searchTitle)
      );
    });
  },
};

export default JobTitleSingleton;
