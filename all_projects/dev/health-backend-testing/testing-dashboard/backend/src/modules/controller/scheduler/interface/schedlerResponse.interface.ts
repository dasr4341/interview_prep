import { Facility } from "../../../../lib/db/service/facilities/facilityResponse.interface";

export interface SchedulerRow extends Facility {
    SCHEDULER_ONBOARD: string;
    SCHEDULER_REFRESH: string;
    SCHEDULER_SQS: string;
    SCHEDULER_KIPU_UPLOAD: string;
    SCHEDULER_KIPU_ALERT: string;
    PUBLISHED_SURVEY: string;
    SCHEDULER_DISCHARGE: string;
    SCHEDULER_WEEKLY_REPORT: string;
    SCHEDULER_PATIENT_CARE_TEAM: string;
    SCHEDULER_ASSING_CARE_TEAM: string;
    SCHEDULER_MONTHLY_REPORT: string;
    SCHEDULER_WEEKLY_REPORT_DOWNLOAD: string;
    DEVICE_LOG_HOURLY: string;
    SURVEY_ASSIGN: string;
    CAMPAIGN_SURVEY_REMINDER: string;
    TABLE_LOG: string;
    SURVEY_REPORT_UPLOADER: string;
    DISCHARGE_EHR_PATIENT: string;
    PATIENT_HEALTH_REPORT: string;
    FACITILY_REPORT: string;
    BIOMETRIC_SCORE_UPDTAE: string;
    COMPLETED_ASSESSMENT: string;
}
