import { Router } from 'express'
import Joi from 'joi'
import passport from 'passport'
import { UserModel } from './../models/User.js'

export const authRoute = Router()

const userSchema = Joi.object<DaUser>({
  username: Joi.string().required().trim().min(3).max(16),
  password: Joi.string().required().trim().min(3).max(32),
  displayName: Joi.string().optional().trim().allow(''),
})

authRoute.post('/signin', (req, res, next) => {
  const { value, error } = userSchema.validate(req.body)
  if (error) {
    return next(error)
  }
  req.body = value

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

authRoute.post('/signup', function (req, res, next) {
  const { value, error } = userSchema.validate(req.body)
  if (error) {
    return next(error)
  }
  if (!value.displayName) {
    value.displayName = value.username
  }

  UserModel.register(new UserModel(value), value.password, function (err) {
    if (err) {
      return next(err)
    }

    res.redirect(307, '/api/signin')
  })
})

authRoute.post('/logout', function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.send({ success: true })
  })
})
