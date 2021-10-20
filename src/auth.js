export function getAuthForm() {
   return `
   <form class="mui-form auth-form" id="auth-form">
      <div class="mui-textfield mui-textfield--float-label">
         <input type="email" id="email">
         <label for="email">Your email</label>
      </div>
      <div class="mui-textfield mui-textfield--float-label">
         <input type="password" id="password">
         <label for="password">Your password</label>
      </div>
      <div class="mui--text-center"><button type="submit" id="btnAuth" class="mui-btn mui-btn--raised btn-personal">Log in</button></div>
   </form>
   `
}

export function authWithEmailAndPassword(email, password) {
   const apiKey = 'AIzaSyDMsOF41WH6WVqqdp-S_ZX7ioaZGiuvxYg'
   return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
      method: 'POST',
      body: JSON.stringify({ email, password, returnSecureToken: true }),
      headers: {
         'Content-Type': 'application/json'
      }
   })
      .then(response => response.json())
}