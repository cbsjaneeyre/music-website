const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const db = require('../models/db')()

router.get('/', (req, res, next) => {
  // TODO: Реализовать, подстановку в поля ввода формы 'Счетчики'
  // актуальных значений из сохраненых (по желанию)
  res.render('pages/admin', { title: 'Admin page' })
})

router.post('/skills', (req, res, next) => {
  /*
  TODO: Реализовать сохранение нового объекта со значениями блока скиллов

    в переменной age - Возраст начала занятий на скрипке
    в переменной concerts - Концертов отыграл
    в переменной cities - Максимальное число городов в туре
    в переменной years - Лет на сцене в качестве скрипача
  */

  res.render('pages/admin', {
    age: db.stores.file.store,
    concerts: db.stores.file.store,
    cities: db.stores.file.store,
    years: db.stores.file.store
  })

  res.send('Реализовать сохранение нового объекта со значениями блока скиллов')
})

router.post('/upload', (req, res, next) => {
  /* TODO:
   Реализовать сохранения объекта товара на стороне сервера с картинкой товара и описанием
    в переменной photo - Картинка товара
    в переменной name - Название товара
    в переменной price - Цена товара
    На текущий момент эта информация хранится в файле data.json  в массиве products
  */

  res.render('pages/admin', {
    photo: db.stores.file.store,
    name: db.stores.file.store,
    price: db.stores.file.store
  })

  const form = new formidable.IncomingForm()
  const upload = path.join(__dirname, '../public', 'upload')
  console.log(upload)

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload)
  }

  form.uploadDir = path.join(process.cwd(), upload)

  form.parse(req, (error, fields, files) => {
    if (error) {
      return next(error)
    }

    const valid = validation(fields, files)

    if (valid.error) {
      fs.unlinkSync(files.photo.path)
      return res.redirect('pages/admin')
    }

    const fileName = path.join(upload, files.photo.name)


    fs.rename(files.photo.path, fileName, (error) => {
      if (error) {
        console.error(error.message)
        return
      }

      const dir = fileName.substr(fileName.indexOf('\\'))

      db.set(fields.name, dir)
      db.save()
      res.redirect('pages/admin')
    })
  })

  const validation = (fields, files) => {
    if (files.photo.name === '' || files.photo.size === 0) {
      return { status: 'the photo is not uploaded!', error: true }
    }
    if (!fields.name) {
      return { status: 'no description of the photo is provided!', error: true }
    }
    return { status: 'ok', error: false }
  }

  // res.send('Реализовать сохранения объекта товара на стороне сервера')
})

module.exports = router
