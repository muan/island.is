import { gql } from '@apollo/client'

export const UploadFileToCourtMutation = gql`
  mutation UploadFileToCourt($input: UploadFileToCourtInput!) {
    uploadFileToCourt(input: $input) {
      success
    }
  }
`

export const PoliceCaseFilesQuery = gql`
  query GetPoliceCaseFiles($input: PoliceCaseFilesQueryInput!) {
    policeCaseFiles(input: $input) {
      id
      name
      policeCaseNumber
    }
  }
`
