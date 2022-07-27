
// Need-update
export interface GithubResponse {
  version: number
  downloadLink: string
}
export interface UpdateReply {
  requireUpdate: boolean
  currentVersion: number
  githubResponse: GithubResponse

}

