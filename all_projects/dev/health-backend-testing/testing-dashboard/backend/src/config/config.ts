import { EnvironmentList } from "./config.enum";

export const config = {
  timeFormat: 'yyyy-MM-dd HH:mm:ss zzz',
  defaultTimeFormat: 'yyyy-MM-dd HH:mm:ssXXX',
  defaultTimeZone: 'Asia/Kolkata',
  schedulerConfig: {
    SCHEDULER_ONBOARD: '10 13 * * *',
    SCHEDULER_SQS: '0,30 * * * *',
    SCHEDULER_KIPU_ALERT: '*/15 * * * *',
    SCHEDULER_DISCHARGE: '22 13 * * *',
    SCHEDULER_PATIENT_CARE_TEAM: '15 13 * * *',
    SCHEDULER_ASSING_CARE_TEAM: '20 13 * * *',
    SCHEDULER_WEEKLY_REPORT_DOWNLOAD: '10 16 * * 1',
    CAMPAIGN_SURVEY_REMINDER: '20,50 * * * *',
    DISCHARGE_EHR_PATIENT: '15 13 * * *',
    FACITILY_REPORT: '10 8 * * *',
    BIOMETRIC_SCORE_UPDTAE: '5 7 * * *',
    // ------------  SPL Case --------------
    COMPLETED_ASSESSMENT: '1 */1 * * *',
    SCHEDULER_WEEKLY_REPORT: '0,30 * * * *',
    SCHEDULER_MONTHLY_REPORT: '0,30 * * * *',
    SURVEY_ASSIGN: '15,45 * * * *',
    // SPL Case :: config
  },
  schedulerConfigSplCase: {
    weekly: {
      name: 'SCHEDULER_WEEKLY_REPORT',
      trigger: [
        {
          hr: 8,
          min: 30,
        },
        {
          hr: 9,
          min: 0,
        },
      ],
    },
    monthly: {
      name: 'SCHEDULER_MONTHLY_REPORT',
      trigger: [
        {
          hr: 9,
          min: 30,
        },
        {
          hr: 10,
          min: 0,
        },
      ],
    },
    completedAssessment: {
      name: 'COMPLETED_ASSESSMENT',
      trigger: [
        {
          hr: 8,
          min: 0,
        },
      ],
    },
    surveyAssign: {
      name: 'SURVEY_ASSIGN',
      trigger: [
        {
          hr: 10,
          min: 15,
        },
      ],
    },
    surveyReminder: {
      name: 'CAMPAIGN_SURVEY_REMINDER',
      trigger: [
        {
          hr: 10,
          min: 0,
        },
        {
          hr: 15,
          min: 0,
        },
        {
          hr: 20,
          min: 0,
        },
      ],
    },
  },
  kipu: {
    patientUrl: '/api/patients/latest',
    patientCareTeamUrl: '/api/patients/care_teams',
  },
  colors: [
    '#FF6633',
    '#FFB399',
    '#FF33FF',
    '#FFFF99',
    '#00B3E6',
    '#E6B333',
    '#3366E6',
    '#999966',
    '#99FF99',
    '#B34D4D',
    '#80B300',
    '#809900',
    '#E6B3B3',
    '#6680B3',
    '#66991A',
    '#FF99E6',
    '#CCFF1A',
    '#FF1A66',
    '#E6331A',
    '#33FFCC',
    '#66994D',
    '#B366CC',
    '#4D8000',
    '#B33300',
    '#CC80CC',
    '#66664D',
    '#991AFF',
    '#E666FF',
    '#4DB3FF',
    '#1AB399',
    '#E666B3',
    '#33991A',
    '#CC9999',
    '#B3B31A',
    '#00E680',
    '#4D8066',
    '#809980',
    '#E6FF80',
    '#1AFF33',
    '#999933',
    '#FF3380',
    '#CCCC00',
    '#66E64D',
    '#4D80CC',
    '#9900B3',
    '#E64D66',
    '#4DB380',
    '#FF4D4D',
    '#99E6E6',
    '#6666FF',
  ],
  poolConfig: (dbInstance: EnvironmentList) => {
    if(process.env[`db_user_${dbInstance}`]) {
      return {
        user: process.env[`db_user_${dbInstance}`],
        host: process.env[`db_host_${dbInstance}`],
        database: process.env[`db_database_${dbInstance}`],
        password: process.env[`db_password_${dbInstance}`],
        port: Number(process.env[`db_port_${dbInstance}`]),
      }
    }
    return null;
  }
};


