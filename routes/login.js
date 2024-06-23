const express = require('express')
const passport = require('passport')
const jwt = require('passport-jwt')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('pages/login', { title: 'SigIn page' })
})

router.post('/', (req, res, next) => {
  // TODO: Реализовать функцию входа в админ панель по email и паролю
  passport.authenticate('local', (error, admin) => {
    if (error) {
      return next(error)
    }

    if (!admin) {
      return res.send('wrong email or password')
    }

    req.login(admin, () => {
      const body = { _id: admin.id, email: admin.email }
      const token = jwt.sign({ admin: body }, 'admin_secret')

      return res.json({ token })
    })
  })(req, res, next)
})

router.get('/', passport.authenticate('jwt', { session: false }), (res, req) => {
  if (!req.admin) {
    res.json({
      username: 'notAdmin'
    })
  }
  res.json(req.admin)
})

module.exports = router
