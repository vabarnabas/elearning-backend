import { Response } from "express"

class CustomError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "HttpError"
    this.status = status
  }
}

export function BadRequestError(res?: Response) {
  const status = 400
  const message =
    "Bad Request: Your request is missing a required parameter(s)."

  if (!res) {
    throw new CustomError(status, message)
  }

  return res.status(status).json({
    error: message,
  })
}

export function UnauthorizedError(res?: Response) {
  const status = 401
  const message =
    "Unauthorized: Please provide valid authentication credentials."

  if (!res) {
    throw new CustomError(status, message)
  }

  return res.status(status).json({
    error: message,
  })
}

export function ForbiddenError(res?: Response) {
  const status = 403
  const message =
    "Forbidden: You do not have permission to access this resource."

  if (!res) {
    throw new CustomError(status, message)
  }

  return res.status(status).json({
    error: message,
  })
}

export function NotFoundError(res?: Response) {
  const status = 404
  const message = "Not Found: The resource you are looking for does not exist."

  if (!res) {
    throw new CustomError(status, message)
  }

  return res.status(status).json({
    error: message,
  })
}

export function InternalServerError(res?: Response) {
  const status = 500
  const message =
    "Internal Server Error: The server has encountered a situation it does not know how to handle."

  if (!res) {
    throw new CustomError(status, message)
  }

  return res.status(status).json({
    error: message,
  })
}
