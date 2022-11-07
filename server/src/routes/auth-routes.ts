import { Router } from 'express'
import passport from 'passport'

export const authRoute = Router()

authRoute.post('/signin', (req, res, next) => {
  // console.log(req.isAuthenticated(), req.session)
  const responseData: ActionResult & { user?: unknown } = { success: false }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (user) {
      return req.logIn(user, (err) => {
        if (err) {
          return next(err)
        }
        responseData.success = true
        responseData.user = {
          _id: user._id,
          username: user.username,
          displayName: user.displayName,
        }
        res.send(responseData)
      })
    }
    if (info) {
      responseData.message = info.message
    }
    res.send(responseData)
  })(req, res, next)
})

authRoute.get('/me', (req, res) => {
  const responseData: ActionResult & { user?: unknown } = { success: false }

  if (!req.isAuthenticated()) {
    responseData.message = 'Please login first.'
    return res.send(responseData)
  }

  responseData.success = true
  responseData.user = req.user

  res.send(responseData)
})
