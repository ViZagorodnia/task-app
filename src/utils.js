export function isValid(value) {
   return value.length >= 10
}

// ============ Modal view =================

export function createModal(title, content) {
   const modal = document.createElement('div')
   modal.classList.add('modal-window')

   modal.innerHTML = `
      <div class="mui--text-display1 mui--text-center">${title}</div>
      <div class="mui--text-black-54">${content}</div>
   `

   mui.overlay('on', modal)
}

export function closeModal() {
   mui.overlay('off')
}