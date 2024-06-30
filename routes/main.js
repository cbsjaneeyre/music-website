const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', (req, res, next) => {
  const msgemail = req.flash('msg')[0]
  
  res.render('pages/index', { 
    title: 'Main page', 
    products: db.get('products').value(), 
    skills: db.get('skills').value(), 
    msgemail 
  })
})

router.post('/', (req, res, next) => {
  // TODO: Реализовать функционал отправки письма.

  const { name, email, message } = req.body

  if (!name || !email || !message) {
    req.flash('msg', 'fill in all the blanks!')
    res.redirect('/')
  } else {
    db.get('messages').push({ name, email, message }).write()
    req.flash('msg', 'the message is delivered!')
    res.redirect('/')
  }
})

module.exports = router
