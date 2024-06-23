const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const session = require('express-session')

const FileStore = require('session-file-store')(session)

const JWTStrategy = passportJWT.Strategy;

const mainRouter = require('./routes/')

const app = express()

app.use(session({
  store: new FileStore(),
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

const admin = {
  id: '1',
  email: 'test@email.com',
  password: 'qwerty1234'
}

passport.serializeUser((admin, done) => {
  done(null, admin.id)
})

passport.deserializeUser((id, done) => {
  const _user = admin.id === id ? admin : false
  done(null, _user)
})

passport.use(new LocalStrategy({
  usernameField: 'email'
}, (email, password, done) => {
  if (email === admin.email && password === admin.password) {
    return done(null, admin)
  } else {
    return done(null, false)
  }
}))

passport.use(new JWTStrategy({
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'admin_secret'
// eslint-disable-next-line camelcase
}, (jwt_payload, done) => {
  if (admin.id === jwt_payload.user._id) {
    return done(null, admin)
  } else {
    return done(null, false, {
      message: 'token is not matched'
    })
  }
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

process.env.NODE_ENV === 'development'
  ? app.use(logger('dev'))
  : app.use(logger('short'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', mainRouter)

// catch 404 and forward to error handler
app.use((req, __, next) => {
  next(
    createError(404, `Ой, извините, но по пути ${req.url} ничего не найдено!`)
  )
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(3000, () => {})
