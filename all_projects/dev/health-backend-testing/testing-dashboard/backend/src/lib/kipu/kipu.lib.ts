import CryptoJS from 'crypto-js'
import fetch from 'node-fetch'
import FormData from 'form-data'
import fs from 'fs'

export default class Kipu {
  baseURL = 'https://kipuapi.kipuworks.com'
  appName = 'Pretaa HealthCare'
  appId: string
  secretKey: string
  accessId: string
  
  constructor(appId: string, secretKey: string, accessId: string) {
    this.appId = appId
    this.secretKey = secretKey
    this.accessId = accessId
  }

  #getEncodedSignature(canonicalString: any) {
    let hmac = CryptoJS.HmacSHA1(canonicalString, this.secretKey)
    let signature = CryptoJS.enc.Base64.stringify(hmac)
    return signature
  }

  #addAppId(uri:any) {
    if (uri.includes('?')) {
      uri = uri + `&app_id=${this.appId}`
    } else {
      uri = uri + `?app_id=${this.appId}`
    }
    return uri
  }

  #getMD5(content:any) {
    let md5 = CryptoJS.MD5(content)
    let md5Base64 = CryptoJS.enc.Base64.stringify(md5)
    return md5Base64
  }

  async get(uri:any) {
    uri = this.#addAppId(uri)

    let dateString = (new Date() as any).toGMTString()

    let canonicalString = `,,${uri},${dateString}`
    let signature = this.#getEncodedSignature(canonicalString)

    let URL = this.baseURL + uri
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.kipusystems+json; version=3',
        'Authorization': `APIAuth ${this.accessId}:${signature}`,
        'Date': dateString
      }
    });
    const data = await response.json()
    return data
  }

  async post(uri:any, content:any) {
    let requestBody = {
      document: {
        recipient_id: this.appId,
        sending_app_name: this.appName,
        data: content
      }
    }

    const contentType = 'application/json'

    const contentMD5 = this.#getMD5(requestBody)

    let dateString = (new Date() as any).toGMTString()

    let canonicalString = `${contentType},${contentMD5},${uri},${dateString}`
    let signature = this.#getEncodedSignature(canonicalString)

    let URL = this.baseURL + uri
    let requestHeaders = {
      'Accept': 'application/vnd.kipusystems+json; version=3',
      'Authorization': `APIAuth ${this.accessId}:${signature}`,
      'Content-Type': 'application/json',
      'Content-MD5': contentMD5,
      'Date': dateString
    }
    
    const response = await fetch(URL, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody)
    })
    const data = await response.json()
    return data

  }

  async postForm(uri: string, content: { firstName: any; lastName: any; id: any; filename: fs.PathLike }) {

    let formData = new FormData()

    formData.append('document[recipient_id]', this.appId)

    formData.append('document[data][first_name]', content.firstName)
    formData.append('document[data][last_name]', content.lastName)
    formData.append('document[data][patient_id]', content.id)

    formData.append('document[data][incoming_patch]', 'true')
    formData.append('document[data][update_patient_attributes]', 'true')
    formData.append('document[data][update]', 'true')
    formData.append('document[data][ext_username]', 'Pretaa API')

    formData.append('document[attachments_attributes][0][attachment_patient_process_id]', 60)
    formData.append('document[attachments_attributes][0][attachment]', fs.createReadStream(content.filename))


    const boundary = formData.getBoundary();
    const contentType = `multipart/form-data; boundary=${boundary}`

    const contentMD5 = this.#getMD5(formData)

    let dateString = (new Date() as any).toGMTString()

    let canonicalString = `${contentType},${contentMD5},${uri},${dateString}`
    let signature = this.#getEncodedSignature(canonicalString)

    let URL = this.baseURL + uri
    let requestHeaders = {
      'Accept': 'application/vnd.kipusystems+json; version=3',
      'Authorization': `APIAuth ${this.accessId}:${signature}`,
      'Content-Type': contentType,
      'Content-MD5': contentMD5,
      'Date': dateString
    }
    const response = await fetch(URL, {
      method: 'PATCH',
      headers: requestHeaders,
      body: formData
    })
    const data = await response.json()
    return data

  }
}

// https://malibudetoxcenter.kipuworks.com/patients/1845/edit

// updated discharge date to 29 july
// updated admission date to 24th of july
// OCR ID as service