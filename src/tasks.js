export class Task {
   // ============== POSTing tasks to DB and localStorage ============
   static create(task, userId, token) {
      return fetch(`https://podcast-viktoria-app-default-rtdb.firebaseio.com/${userId ? userId + '/' : ''}tasks.json`, {
         method: 'POST',
         body: JSON.stringify(task),
         headers: {
            'Content-Type': 'application/json'
         }
      })
         .then(response => response.json())
         .then(response => {
            task.id = response.name
            console.log('from creating task', task)

            return task
         })
         .then(addToLocalStorage)
         .then(() => {
            setTimeout(Task.renderList(userId, token), 0)
         })
   }

   // ============== Updating user's task list ============


   static updateTask(taskId, checked, user) {
      return fetch(`https://podcast-viktoria-app-default-rtdb.firebaseio.com/${user ? user + '/' : ''}tasks/${taskId}.json`, {
         method: 'PATCH',
         body: JSON.stringify({
            'checked': checked
         }),
         headers: {
            "Content-Type": "application/json"
         }
      })
         .then(response => response.json())
         .then(res => {
            console.log('from updateTask', res)

         })
   }

   // ============== Rendering ============

   static renderList(user, token) {

      let tasks = []
      const list = document.querySelector('#list')

      if (user && token) {
         getTasksFromDB(user, token)
            .then(res => {
               tasks = res
               console.log('from renderlist DB', tasks)
               list.innerHTML = renderHTML(tasks)
            })
      } else {
         tasks = gettaskFromLocalStorage()
         console.log('from renderlist LS', tasks)
         list.innerHTML = renderHTML(tasks)
      }

   }

   // ============== Update tasks in LocalStorage ============

   static updateTaskLS(taskId, check) {
      const taskList = JSON.parse(localStorage.getItem('tasks'))
      console.log(taskList)

      for (var i = 0; i < taskList.length; i++) {
         if (taskId === taskList[i].id) {  //look for match with name
            taskList[i].checked = check
            break
         }
      }

      localStorage.setItem('tasks', JSON.stringify(taskList))
   }
}

// ============== HTML template ============

function toCard(task) {
   return `
   <div class="mui-col-xs-6">
   <div class="taskCard">
   <div class="mui--text-black-54">
      ${new Date(task.date).toLocaleDateString()}
      ${new Date(task.date).toLocaleTimeString()}
   </div>
   <div class="mui-checkbox">
      <label">
      <input id="${task.id}" type="checkbox" class="checkbox" value="" ${task.checked ? "checked" : ''}>
      ${task.text}
      </label>
   </div>
   </div>
   </div>
   `
}

function renderHTML(tasks) {
   const html = tasks.length
      ? tasks.map(toCard).join('')
      : `<div class="mui--text-headline taskInfo">You have no local task, please log in to see all your tasks</div></div>`

   return html
}

// ============== Work with localStorage ============

function addToLocalStorage(task) {
   const all = gettaskFromLocalStorage()
   all.push(task)
   localStorage.setItem('tasks', JSON.stringify(all))
}

function gettaskFromLocalStorage() {
   return JSON.parse(localStorage.getItem('tasks') || '[]')
}



// ============== Getting tasks from DB only for auth user ============

function getTasksFromDB(userId, token) {
   return fetch(`https://podcast-viktoria-app-default-rtdb.firebaseio.com/${userId}/tasks.json?auth=${token}`)
      .then(response => response.json())
      .then(response => {

         if (response && response.error) {
            return `<p class="error">${response.error}</p>`
         }
         // ============== Converting collecion to Array of user tasks ==============
         return response
            ? Object.keys(response).map(key => ({
               ...response[key],
               id: key
            }))
            : []
      })
}