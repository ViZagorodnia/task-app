import { Task } from './tasks'
import { closeModal, createModal, isValid } from './utils'
import './style.css'
import { authWithEmailAndPassword, getAuthForm } from './auth'


const form = document.querySelector('#form')
const input = form.querySelector('#task-input')
const btnSubmit = form.querySelector('#btnSubmit')
const btnModal = document.querySelector('#modal')
const list = document.querySelector('#list')

let userId = ''
let idToken = ''

window.addEventListener('load', Task.renderList())

btnModal.addEventListener('click', openModal)
form.addEventListener('submit', submitFormHandler)
list.addEventListener('change', checkboxChange)


// ============== Validation of task length ============
input.addEventListener('input', () => {
   btnSubmit.disabled = !isValid(input.value)
})


// ============== Creating tasks ============

function submitFormHandler(event) {
   event.preventDefault()

   if (isValid(input.value)) {
      const task = {
         text: input.value.trim(),
         date: new Date().toJSON(),
         checked: false
      }
      btnSubmit.disabled = true
      Task.create(task, userId, idToken).then(() => {
         console.log('task', task)
         input.value = ''
         input.className = ''
      })
   }
}

// ============== Auth functionality ============

function openModal() {
   createModal('Authorization', getAuthForm())
   document
      .getElementById('auth-form')
      .addEventListener('submit', authFormHandler, { once: true })
}

function authFormHandler(event) {
   event.preventDefault()

   const btn = event.target.querySelector('button')
   const email = event.target.querySelector('#email').value
   const password = event.target.querySelector('#password').value

   btn.disabled = true
   authWithEmailAndPassword(email, password)
      .then(data => {
         userId = data.localId
         idToken = data.idToken
         return ([data.localId, data.idToken])
      })
      .then(result => Task.renderList(result[0], result[1]))
      .then(renderModalAfterAuth)
      .then(() => btn.disabled = false)
}

function renderModalAfterAuth(content) {
   console.log(content)

   if (typeof content === 'string') {
      createModal('Error', content)
   } else {
      closeModal()
   }
}


// ============== Updating task after cheking checkbox ============
function checkboxChange(event) {
   console.log(event)
   const taskId = event.target.id
   const checked = event.target.checked
   if (userId) {
      Task.updateTask(taskId, checked, userId)
   }

   Task.updateTaskLS(taskId, checked)

}