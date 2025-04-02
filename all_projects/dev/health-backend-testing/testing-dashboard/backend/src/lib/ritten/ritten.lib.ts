import fetch from 'node-fetch';
import { Exception } from '../../exception/Exception';
import { StatusCodes } from 'http-status-codes';
import { messageData } from '../../config/messageData';
import { NextFunction } from 'express';
import { RittenFormattedPatientData, RittenPatientRawDataInterface, RittenPatientRawCareTeamData, RittenFormattedPatientDataWithCareTeam, PatientCareTeamsInterface } from './interface/ritten.interface';

const config = {
  login: 'https://login.beta.ritten.io/oauth/token',
  patientDetails: 'https://api.beta.ritten.io/v1/patients/',
  careTeamDetails: 'https://api.beta.ritten.io/v1/staff',
};

enum CareTeamTypesEnum {
  PRIMARY_THERAPIST = 'PRIMARY_THERAPIST',
  OTHER = 'other',
}
const login = async (clientId: string, clientSecret: string, audience: string) => {
  const loginResponse = await fetch(config.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      audience,
      grant_type: 'client_credentials',
    }),
  });

  const loginData = await loginResponse.json();
  if (loginResponse?.status === StatusCodes.OK && loginData?.access_token) {
    return loginData;
  }

  throw new Exception(messageData.ritten.failedToLogin, { loginResponse }, StatusCodes.INTERNAL_SERVER_ERROR);
};

const getPatientDetails = async (token: string, patientId: string) => {
  const patientResponse = await fetch(config.patientDetails + patientId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'X-Ritten-Tenant': 'pretaa',
      Authorization: `Bearer ${token}`,
    },
  });

  const patientListData = await patientResponse.json();

  if (patientResponse?.status === StatusCodes.OK) {
    return patientListData as RittenPatientRawDataInterface;
  }

  throw new Exception(messageData.ritten.failedToFetchData, { patientResponse }, StatusCodes.INTERNAL_SERVER_ERROR);
};

const getAllPatientCareTeam = async (token:string) => {
  const careTeamResponse = await fetch(config.careTeamDetails, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'X-Ritten-Tenant': 'pretaa',
    },
  });
  const careTeamData = await careTeamResponse.json();

  if (careTeamResponse?.status === StatusCodes.OK) {
    return careTeamData as RittenPatientRawCareTeamData[];
  }
  throw new Exception(messageData.ritten.failedToFetchData, { careTeamResponse }, StatusCodes.INTERNAL_SERVER_ERROR);
};

const getAllPatientData = async (accessToken: string, patientIds: string[]) => {
  const patientDetails: RittenFormattedPatientDataWithCareTeam[] = [];
  
  for (const patientId of patientIds) {
    const {
      id,
      dob,
      name: {
        first: first_name, // first_name
        middle: middle_name, // middle_name
        last: last_name, //last_name
        chosenName: gender, // gender
      },
      mrn: mr_number,
      latestClinicalProgram,
      careTeam,
      diagnoses,
      emails,
    } = await getPatientDetails(accessToken, patientId);

    const diagnosisCode =
      diagnoses?.reduce((prevState: string, currentState) => {
        return prevState + ' ' + currentState.diagnosis;
      }, '') || '';

    const { id: primaryTherapistId, ...requiredPrimaryTherapistData } = careTeam?.primaryClinician;


    // care_team_details_id , 
    patientDetails.push({
      source_system_patient_id: id,
      first_name,
      middle_name,
      last_name,
      email: !!emails.length ? emails[0] : null,
      gender,
      dob,
      discharge_date: latestClinicalProgram?.dischargeDate || null,
      intake_date: latestClinicalProgram?.admitDate || null,
      level_of_care: latestClinicalProgram?.levelOfCare || null,
      anticipated_discharge_date: latestClinicalProgram?.estimatedDischargeDate || null,
      mr_number,
      diagnosis_codes: diagnosisCode,
      careTeam,
      patient_care_teams: careTeam?.primaryClinician?.email
        ? [
            {
              care_team_types: CareTeamTypesEnum.PRIMARY_THERAPIST,
              email: requiredPrimaryTherapistData.email,
              first_name: requiredPrimaryTherapistData.first,
              middle_name: requiredPrimaryTherapistData.middle,
              last_name: requiredPrimaryTherapistData.last,
            },
          ]
        : [],
    });
  }

  return patientDetails;
};

const combinePatientDetailsWithCareTeamDetails = (patientDetails: RittenFormattedPatientDataWithCareTeam[], careTeamData:RittenPatientRawCareTeamData[] ) => {


  return patientDetails.map(p => {
    const othersCareTeamId = p.careTeam.teamUserIds;
    const careTeamTypeOtherDetails: PatientCareTeamsInterface[]= [];
    
    for (const id of othersCareTeamId) {
      const findRes = careTeamData.find(team => team.id === id);
      if (findRes?.first) {
        careTeamTypeOtherDetails.push({
          care_team_types: CareTeamTypesEnum.OTHER,
          email: findRes.email,
          first_name: findRes.first,
          middle_name: findRes.middle,
          last_name: findRes.last,
        });
      }
    }

    const { careTeam, ...dataRequired } = p;
    return {
      ...dataRequired,
      patient_care_teams: [...p.patient_care_teams, ...careTeamTypeOtherDetails]
    }
  });



}

export const Ritten = async (clientId: string, clientSecret: string, audience: string, next: NextFunction, patientDetailsToFetch: string[]) => {
  try {
    const { access_token: accessToken } = await login(clientId, clientSecret, audience);

    const allPatientData = await getAllPatientData(accessToken, patientDetailsToFetch);
    const allCareTeamData = await getAllPatientCareTeam(accessToken);

    return combinePatientDetailsWithCareTeamDetails(allPatientData, allCareTeamData);
  } catch (e) {
    next(e);
  }
};
