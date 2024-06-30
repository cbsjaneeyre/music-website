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
 
  const { age, concerts, cities, years } = req.body

  if (!age || !concerts || !cities || !years) {
    req.flash('msgskill', 'fill in all the blanks!')
    res.redirect('/admin')
  } else {
    db.get('artist').push({ age, concerts, cities, years }).write()
    req.flash('msgskill', 'done!')
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
      req.flash('msgfile', 'error')
      return res.redirect('/admin')
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
      req.flash('msgfile', 'success!')
      res.redirect('/admin')
    })
  })

  const validation = (fields, files) => {
    if (files.photo.name === '' || files.photo.size === 0) {
      req.flash('msgfile', 'the photo is not uploaded!')
      return res.redirect('/admin')
    }
    if (!fields.name) {
      req.flash('msgfile', 'no description of the photo is provided!')
      return res.redirect('/admin')
    }

    req.flash('msgfile', 'done!')
    res.redirect('/admin')
  }

  const { name, price } = req.body

  if (!name || !price ) {
    req.flash('msgfile', 'fill in all the blanks!')
    res.redirect('/admin')
  } else {
    db.get('products').push({ name, price }).write()
    req.flash('msgfile', 'done!')
    res.redirect('/admin')
  }
})

module.exports = router
