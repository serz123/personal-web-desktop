/**
 * The main script file of the application.
 *
 * @author Vanja Maric <vm222hx@student.lnu.se>
 * @version 1.0.0
 */

const icons = document.querySelectorAll('.icon-container')

// Service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./serviceworker.js')
      console.log('ServiceWorker: Registration successful with scope: ', registration.scope)
    } catch (error) {
      console.log('ServiceWorker: Registration failed: ', error)
    }
  })
}

// Make icons dragable
icons.forEach(figure => {
  figure.addEventListener('dragstart', event => {
    // Set the data that will be dragged
    event.dataTransfer.setData('text/plain', '')

    // Set the dragged element's position
    figure.style.position = 'absolute'
    figure.style.top = `${event.clientY - figure.offsetHeight / 2}px`
    figure.style.left = `${event.clientX - figure.offsetWidth / 2}px`
  })

  figure.addEventListener('drag', event => {
    // Update the position of the dragged element as it is dragged
    figure.style.top = `${event.clientY - figure.offsetHeight / 2}px`
    figure.style.left = `${event.clientX - figure.offsetWidth / 2}px`
  })

  figure.addEventListener('dragend', event => {
    // Update the position of the dragged element when dragging ends
    figure.style.top = `${event.clientY - figure.offsetHeight / 2}px`
    figure.style.left = `${event.clientX - figure.offsetWidth / 2}px`
  })
})

/**
 * Focuse one element.
 *
 * @param {*} ev Element to focus.
 */
function focusElement (ev) {
  const allElements = Array.from(document.querySelectorAll('my-dock-window'))
  ev.target.classList.remove('notfocused')
  ev.target.classList.add('focused')
  for (let i = 0; i < allElements.length; i++) {
    if (allElements[i] !== ev.target) {
      allElements[i].classList.remove('focused')
      allElements[i].classList.add('notfocused')
    }
  }
}

document.addEventListener('click', event => {
  if (event.target.tagName === 'MY-DOCK-WINDOW') {
    focusElement(event)
  }
  event.stopPropagation()
})

// Open sub app when icon is clicked
document.addEventListener('click', event => {
  if (event.target.classList.contains('icon') || event.target.classList.contains('dockIcon')) {
    openSubapp(event.target.id)
  }
  event.stopPropagation()
})

/**
 * Opens specific subapp.
 *
 * @param {*} evId Subapp to open.
 */
function openSubapp (evId) {
  const bodyEl = document.querySelector('body')
  const wnd = document.createElement('my-dock-window')
  let href =""
  if (evId === 'memoryicon' || evId === 'memoryDockIcon') {
    wnd.setAttribute('app', 'my-memory-game')
    wnd.setAttribute('name', 'Memory')
  } else if (evId === 'chaticon' || evId === 'chatDockIcon') {
    wnd.setAttribute('app', 'my-sockets-messages')
    wnd.setAttribute('name', 'Chat')
  } else if (evId === 'recordericon' || evId === 'recorderDockIcon') {
    wnd.setAttribute('app', 'my-recorder')
    wnd.setAttribute('name', 'Recorder')
  }

  bodyEl.appendChild(wnd)
}

// Remove closed window
document.addEventListener('removeEl', event => {
  const elToClose = event.target
  const body = document.querySelector('body')
  body.removeChild(elToClose)
  event.stopPropagation()
})

icons.forEach(figure => {
  figure.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      openSubapp(figure.querySelector('.icon').id)
    }
  })
})
