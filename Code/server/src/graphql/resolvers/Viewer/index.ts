import { IResolvers } from "@graphql-tools/utils"
import { Viewer, Database, User } from "../../../lib/types"
import { Response, Request } from "express"
import { Google } from "../../../lib/api"
import { LogInArgs } from "./types"
import crypto from "crypto"

const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  signed: true,
  secure: process.env.NODE_ENV === "development" ? false : true,
}

async function logInViaCookie(
  token: string,
  db: Database,
  req: Request,
  res: Response
): Promise<User | null> {
  const updateReq = await db.users.findOneAndUpdate(
    { _id: req.signedCookies.viewer },
    { $set: { token } },
    { returnDocument: "after" }
  )
  const viewer = updateReq.value

  if (!viewer) {
    res.clearCookie("viewer", cookieOptions)
  }

  return viewer
}

const logInViaGoogle = async (
  code: string,
  token: string,
  db: Database,
  res: Response
): Promise<User | null> => {
  const { user } = await Google.logIn(code)

  if (!user) {
    throw new Error("Google Login error")
  }

  /* 
  We are trying to get the username,picture,email field using the google auth
  */
  const userNamesList = user.names && user.names.length ? user.names : null
  const userPhotosList = user.photos && user.photos.length ? user.photos : null
  const userEmailList =
    user.emailAddresses && user.emailAddresses.length
      ? user.emailAddresses
      : null

  //User Display Name
  const userName = userNamesList ? userNamesList[0].displayName : null

  //User Id
  const userId =
    userNamesList &&
    userNamesList[0].metadata &&
    userNamesList[0].metadata.source
      ? userNamesList[0].metadata.source.id
      : null

  //User Picture Avatar
  const userAvatar =
    userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null

  //User Email
  const userEmail =
    userEmailList && userEmailList[0].value ? userEmailList[0].value : null

  if (!userId || !userName || !userAvatar || !userEmail) {
    throw new Error("Google Login error")
  }

  //updateOne is a mongoDB method that updates a single document.
  const updateRes = await db.users.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        name: userName,
        avatar: userAvatar,
        contact: userEmail,
        token,
      },
    },
    { returnDocument: "after" }
  )

  let viewer = updateRes.value

  if (!viewer) {
    const insertResult = await db.users.insertOne({
      _id: userId,
      token,
      name: userName,
      avatar: userAvatar,
      contact: userEmail,
      income: 0,
      bookings: [],
      listings: [],
    })
    viewer = await db.users.findOne({ _id: insertResult.insertedId })
  }

  res.cookie("viewer", userId, {
    ...cookieOptions,
    //expiration to 1 year, in milliseconds
    maxAge: 365 * 24 * 60 * 60 * 1000,
  })
  return viewer
}

export const viewerResolvers: IResolvers = {
  Query: {
    authUrl: () => {
      try {
        return Google.authUrl
      } catch (error) {
        throw new Error(`Error query failed ${error}`)
      }
    },
  },
  Mutation: {
    //sign in with google auth url or cookie session
    logIn: async (
      _root: undefined,
      { login }: LogInArgs,
      { db, req, res }: { db: Database; req: Request; res: Response }
    ): Promise<Viewer> => {
      try {
        const code = login ? login.code : null
        //create a randomly generated 16 character string when user logs in
        const token = crypto.randomBytes(16).toString("hex")

        const viewer = code
          ? await logInViaGoogle(code, token, db, res)
          : await logInViaCookie(token, db, req, res)

        //client side will see the didRequest, but will see no user information exists
        if (!viewer) {
          return { didRequest: true }
        }

        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true,
        }
      } catch (error) {
        throw new Error(`Failed Login ${error}`)
      }
    },
    logOut: (
      _root: undefined,
      _args: unknown,
      { res }: { res: Response }
    ): Viewer => {
      try {
        res.clearCookie("viewer", cookieOptions)
        return { didRequest: true }
      } catch (error) {
        throw new Error(`Failed to log out ${error}`)
      }
    },
  },
  Viewer: {
    id: (viewer: Viewer): string | undefined => {
      return viewer._id
    },
    hasConnectedWallet: (viewer: Viewer): boolean | undefined => {
      return viewer.walletId ? true : undefined
    },
  },
}
