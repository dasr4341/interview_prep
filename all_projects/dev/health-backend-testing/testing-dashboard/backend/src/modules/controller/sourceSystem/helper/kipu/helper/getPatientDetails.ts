import { IKipuPatientDataFromDb, IPatientFormattedDataFromDb } from '../interface/kipu.interface';

export function getPatientDetails(patientDataFromDb: IKipuPatientDataFromDb[]) {
  // formatting data from db -> to reduce time complexity
  let prevId = '';
  return patientDataFromDb.reduce((prevData: { [key: string]: IPatientFormattedDataFromDb }, currentData) => {
    let patientContacts: {
      full_name: string;
      relationship: string;
      contact_type: string;
      phone: string;
      alternative_phone: string;
      address: string;
      email: string;
      notes: string;
    }[] = [];

    const {
      patient_contacts_full_name,
      patient_contacts_relationship,
      patient_contacts_contact_type,
      patient_contacts_phone,
      patient_contacts_alternative_phone,
      patient_contacts_address,
      patient_contacts_email,
      ...requiredData
    } = currentData;

    patientContacts.push({
      full_name: currentData.patient_contacts_full_name,
      relationship: currentData.patient_contacts_relationship,
      contact_type: currentData.patient_contacts_contact_type,
      phone: currentData.patient_contacts_phone,
      alternative_phone: currentData.patient_contacts_alternative_phone,
      address: currentData.patient_contacts_address,
      email: currentData.patient_contacts_email,
      notes: currentData.patient_contacts_notes,
    });

    if (prevId === currentData.id) {
      prevData[currentData?.casefile_id].patient_contacts.push(...patientContacts);
    } else {
      prevData[currentData?.casefile_id] = { ...requiredData, patient_contacts: patientContacts };
      prevId = currentData.id;
    }

    return prevData;
  }, {});
}
