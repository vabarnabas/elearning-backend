import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

import { ForbiddenError, UnauthorizedError } from "../../errors/errors"

export default function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(" ")[1]

  if (token == null) {
    return UnauthorizedError(res)
  }

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err, user) => {
    if (err) {
      return ForbiddenError(res)
    }

    req["user"] = user

    next() // Continue to the next middleware or route handler
  })
}
