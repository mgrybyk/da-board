import { Request, NextFunction, Response } from 'express'

import { ApiError } from '../error/error.js'

export const errorConverter = (
  err: { statusCode?: number; message?: string; stack?: string },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err
  if (!(error instanceof ApiError)) {
    const statusCode: number = error.statusCode || 500
    const message = error.message || 'INTERNAL_SERVER_ERROR'

    error = new ApiError(statusCode, message as string, false, err.stack)
  }
  next(error)
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const { statusCode: code, message } = err

  res.locals.errorMessage = err.message

  const response = { code, message }
  if (code !== 404) {
    console.error(err)
  }

  res.status(code).send(response)
}
