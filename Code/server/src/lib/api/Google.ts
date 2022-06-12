/* https://github.com/googleapis/google-api-nodejs-client */

import { google } from "googleapis"

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.PUBLIC_URL}/login`
)

export const Google = {
  authUrl: auth.generateAuthUrl({
    //// 'online' (default) or 'offline' (gets refresh_token)
    access_type: "online",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  }),
  //request to google, to get users access token
  logIn: async (code: string) => {
    /*     token below contains both access and refresh tokens
    not storing tokens, as we aren't using them for anything other than logging in */
    const { tokens } = await auth.getToken(code)
    auth.setCredentials(tokens)

    const { data } = await google.people({ version: "v1", auth }).people.get({
      resourceName: "people/me",
      personFields: "emailAddresses,names,photos",
    })

    //return an object that contains the user's email and name,photos
    return { user: data }
  },
}
