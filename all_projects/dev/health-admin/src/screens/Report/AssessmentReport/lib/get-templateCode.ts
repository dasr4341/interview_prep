import { TemplateCodes } from "../AssementReportForTemplate/assement-report-interface";

enum StandardTemplate {
  BAM_IOP = "BAM_IOP",
  BAM_R = "BAM_R",
  GAD_7 = "GAD_7",
  PHQ_15 = "PHQ_15",
  PHQ_9 = "PHQ_9",
  URICA = "URICA",
}

export function getTemplateCode(templateCode): StandardTemplate {
  if (templateCode === TemplateCodes.PHQ9) {
    return StandardTemplate.PHQ_9;
  } else if (templateCode === TemplateCodes.BAM_IOP) {
    return StandardTemplate.BAM_IOP;
  } else if (templateCode === TemplateCodes.BAM_R) {
    return StandardTemplate.BAM_R;
  } else if (templateCode === TemplateCodes.GAD7) {
    return StandardTemplate.GAD_7;
  } else if (templateCode === TemplateCodes.PHQ15) {
    return StandardTemplate.PHQ_15;
  } else if (templateCode === TemplateCodes.URICA) {
    return StandardTemplate.URICA;
  } else {
    throw new Error('Not implemented');
  }
}