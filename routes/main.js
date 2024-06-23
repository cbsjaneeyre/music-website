const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const config = require('../config.json')
const { products, skills } = require('../data.json')

router.get('/', (req, res, next) => {
  res.render('pages/index', { title: 'Main page', products, skills })
})

router.post('/', (req, res, next) => {
  // TODO: Реализовать функционал отправки письма.
  if (!req.body.name || !req.body.email || !req.body.message) {
    return res.json({ msg: 'Fill in all the blanks', status: 'Error' })
  }

  const transporter = nodemailer.createTransport(config.email.smtp);

  const emailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: config.email.smtp.auth.user,
    subject: config.email.subject,
    message:
      req.body.message.trim().slice(0, 500) +
      `\n Sent from: <${req.body.email}>`
  }

  transporter.sendEmail(emailOptions, function (error, info) {
    if (error) {
      return res.json({
        msg: `An error occured while sending a message!: ${error}`,
        status: 'Error'
      })
    }
    res.json({ msg: 'A message is delivered!', status: 'Ok' })
  })

  // res.send('Реализовать функционал отправки письма')
})

module.exports = router
