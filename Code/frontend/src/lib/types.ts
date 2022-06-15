export interface Viewer {
  id: string | null
  token: string | null
  avatar: string | null
  hasConnectedWallet: boolean | null
  didRequest: boolean
}
