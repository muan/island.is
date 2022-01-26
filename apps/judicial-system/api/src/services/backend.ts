import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'

import { Injectable } from '@nestjs/common'

import type {
  Case,
  CreateCase,
  CreateFile,
  CreatePresignedPost,
  DeleteFileResponse,
  CaseFile,
  PresignedPost,
  RequestSignatureResponse,
  SignatureConfirmationResponse,
  SignedUrl,
  TransitionCase,
  UpdateCase,
  Institution,
  User,
  CreateUser,
  UpdateUser,
  Notification,
  SendNotification,
  SendNotificationResponse,
  UploadFileToCourtResponse,
  PoliceCaseFile,
  UploadPoliceCaseFileResponse,
  UploadPoliceCaseFile,
  CreateDefendant,
  Defendant,
  UpdateDefendant,
  DeleteDefendantResponse,
} from '@island.is/judicial-system/types'

import { environment } from '../environments'

@Injectable()
class BackendAPI extends RESTDataSource {
  baseURL = `${environment.backend.url}/api`

  willSendRequest(req: RequestOptions) {
    req.headers.set('authorization', this.context.req.headers.authorization)
    req.headers.set('cookie', this.context.req.headers.cookie)
  }

  getInstitutions(): Promise<Institution[]> {
    return this.get('institutions')
  }

  getUsers(): Promise<User[]> {
    return this.get('users')
  }

  getUser(id: string): Promise<User> {
    return this.get(`user/${id}`)
  }

  createUser(createUser: CreateUser): Promise<User> {
    return this.post('user', createUser)
  }

  updateUser(id: string, updateUser: UpdateUser): Promise<User> {
    return this.put(`user/${id}`, updateUser)
  }

  getCases(): Promise<Case[]> {
    return this.get('cases')
  }

  getCase(id: string): Promise<Case> {
    return this.get(`case/${id}`)
  }

  createCase(createCase: CreateCase): Promise<Case> {
    return this.post('case', createCase)
  }

  updateCase(id: string, updateCase: UpdateCase): Promise<Case> {
    return this.put(`case/${id}`, updateCase)
  }

  transitionCase(id: string, transitionCase: TransitionCase): Promise<Case> {
    return this.put(`case/${id}/state`, transitionCase)
  }

  requestCourtRecordSignature(id: string): Promise<RequestSignatureResponse> {
    return this.post(`case/${id}/courtRecord/signature`)
  }

  getCourtRecordSignatureConfirmation(
    id: string,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    return this.get(
      `case/${id}/courtRecord/signature?documentToken=${documentToken}`,
    )
  }

  requestRulingSignature(id: string): Promise<RequestSignatureResponse> {
    return this.post(`case/${id}/ruling/signature`)
  }

  getRulingSignatureConfirmation(
    id: string,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    return this.get(
      `case/${id}/ruling/signature?documentToken=${documentToken}`,
    )
  }

  sendNotification(
    id: string,
    sendNotification: SendNotification,
  ): Promise<SendNotificationResponse> {
    return this.post(`case/${id}/notification`, sendNotification)
  }

  extendCase(id: string): Promise<Case> {
    return this.post(`case/${id}/extend`)
  }

  getCaseNotifications(id: string): Promise<Notification[]> {
    return this.get(`case/${id}/notifications`)
  }

  createCasePresignedPost(
    id: string,
    createPresignedPost: CreatePresignedPost,
  ): Promise<PresignedPost> {
    return this.post(`case/${id}/file/url`, createPresignedPost)
  }

  createCaseFile(id: string, createFile: CreateFile): Promise<CaseFile> {
    return this.post(`case/${id}/file`, createFile)
  }

  getCaseFileSignedUrl(caseId: string, id: string): Promise<SignedUrl> {
    return this.get(`case/${caseId}/file/${id}/url`)
  }

  deleteCaseFile(caseId: string, id: string): Promise<DeleteFileResponse> {
    return this.delete(`case/${caseId}/file/${id}`)
  }

  getCaseFiles(id: string): Promise<CaseFile[]> {
    return this.get(`case/${id}/files`)
  }

  uploadCaseFileToCourt(
    caseId: string,
    id: string,
  ): Promise<UploadFileToCourtResponse> {
    return this.post(`case/${caseId}/file/${id}/court`)
  }

  getPoliceCaseFiles(caseId: string): Promise<PoliceCaseFile[]> {
    return this.get(`case/${caseId}/policeFiles`)
  }

  uploadPoliceFile(
    caseId: string,
    uploadPoliceCaseFile: UploadPoliceCaseFile,
  ): Promise<UploadPoliceCaseFileResponse> {
    return this.post(`case/${caseId}/policeFile`, uploadPoliceCaseFile)
  }

  createDefendant(
    caseId: string,
    createDefendant: CreateDefendant,
  ): Promise<Defendant> {
    return this.post(`case/${caseId}/defendant`, createDefendant)
  }

  updateDefendant(
    caseId: string,
    defendantId: string,
    updateDefendant: UpdateDefendant,
  ): Promise<Defendant> {
    return this.put(`case/${caseId}/defendant/${defendantId}`, updateDefendant)
  }

  deleteDefendant(
    caseId: string,
    defendantId: string,
  ): Promise<DeleteDefendantResponse> {
    return this.delete(`case/${caseId}/defendant/${defendantId}`)
  }
}

export default BackendAPI
