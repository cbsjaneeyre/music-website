/* eslint-disable no-undef */
/* eslint-disable prefer-const */
/* eslint-disable node/no-callback-literal */

console.log('Client script')

function prepareSendEmail (e) {
  e.preventDefault()
  const data = {
    name: formEmail.name.value,
    email: formEmail.email.value,
    message: formEmail.message.value
  }
 
  sendJson('/', data, 'POST', data => {
    formEmail.reset()
  })
}
 
function sendJson (url, data, method, cb) {
  
  let xhr = new XMLHttpRequest()
  xhr.open(method, url)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onload = function () {
    let result
    try {
      result = JSON.parse(xhr.responseText)
    } catch (err) {

      cb({ msg: 'There are errors in data', status: 'Error' })
    }
    cb(result)
  }
  xhr.send(JSON.stringify(data))
}
 
const formEmail = document.querySelector('.form-email')
formEmail.addEventListener('submit', prepareSendEmail)
