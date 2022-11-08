import { NextFunction, Request, Response } from 'express'

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    return fn(req, res, next).catch((err) => {
      if (err instanceof Error) {
        return next(err)
      }
      if (typeof err !== 'string') {
        err = JSON.stringify(err)
      }
      next(new Error(err))
    })
  }
