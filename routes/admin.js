const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const db = require('../db')

router.get('/', (req, res, next) => {
  // TODO: Реализовать, подстановку в поля ввода формы 'Счетчики'
  // актуальных значений из сохраненых (по желанию)

  const msgskill = req.flash('msgskill')[0]
  const msgfile = req.flash('msgfile')[0]

  res.render('pages/admin', {
    title: 'Admin page',
    msgskill,
    msgfile
  })
})

router.post('/skills', (req, res, next) => {
  /*
  TODO: Реализовать сохранение нового объекта со значениями блока скиллов

    в переменной age - Возраст начала занятий на скрипке
    в переменной concerts - Концертов отыграл
    в переменной cities - Максимальное число городов в туре
    в переменной years - Лет на сцене в качестве скрипача
  */

  const data = req.body

  if (!data) {
    req.flash('msgskill', 'fill in the blanks!')
    res.redirect('/admin')
  } else {
    Object.keys(data).forEach((item, i) => {
      if (data[item]) {
        db.get(`skills[${i}]`).set('number', data[item]).write()
      }
    })

    req.flash('msgskill', 'success!')
    res.redirect('/admin')
  }
})

router.post('/upload', (req, res, next) => {
  /* TODO:
   Реализовать сохранения объекта товара на стороне сервера с картинкой товара и описанием
    в переменной photo - Картинка товара
    в переменной name - Название товара
    в переменной price - Цена товара
    На текущий момент эта информация хранится в файле data.json  в массиве products
  */

  const form = new formidable.IncomingForm()
  const upload = path.join(__dirname, '../uploads')

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload)
  }

  form.uploadDir = upload

  form.parse(req, (error, fields, files) => {
    if (error) {
      return next(error)
    }

    const file = files.photo[0]

    const valid = validation(fields, file)

    if (valid.error) {
      fs.unlinkSync(file.filepath)

      req.flash('msgfile', valid.error)
      return res.redirect('/admin')
    }

    const fileName = path.join(upload, file.originalFilename)


    fs.rename(file.filepath, fileName, (error) => {
      if (error) {
        console.error(error.message)
        return
      }

      db.get('products')
        .push({
          src: path.join('./', file.originalFilename),
          name: fields.name[0],
          price: fields.price[0]
        })
        .write()

      req.flash('msgfile', valid.status)
      res.redirect('/admin')
    })
  })

  const validation = (fields, files) => {
    if (files.originalFilename === '' || files.size === 0) {
      return { error: 'the photo is not uploaded!' }
    }
    if (!fields.name[0]) {
      return { error: 'no description of the photo is provided!' }
    }

    return { error: null, status: 'success!' }
  }
})

module.exports = router
