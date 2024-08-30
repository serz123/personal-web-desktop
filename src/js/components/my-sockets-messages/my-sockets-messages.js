/**
 * The my-sockets-messages web component module.
 *
 * @author Vanja Maric <vm222hx@student.lnu.se>
 * @version 1.0.0
 */

import '../my-username'
import '../my-message'
import DOMPurify from 'dompurify'

const serverAdress = 'wss://courselab.lnu.se/message-app/socket'

const dataToSend = {
  type: 'message',
  channel: 'my, not so secret, channel',
  key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
}
// height like dock height
/* #receivedMes {
overflow: auto;
grid - area: receiveM;
display: block;
height: 350px;
}
OVO ODREDJUJE VELICINU PORUKA KOJE DOBIJEMO */

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
    display: block;
    height: 440px;
    max-width: 100%;
    perspective: 0px;
    background-color: white;
  
}
my-message {
grid-area: sendM;
}

#receivedMes { 
  overflow: auto;
  grid-area: receiveM;
  display: block;
  height: 350px;
}
#messages_box {
}
</style>
  <div id="messages_box">
  <div id="receivedMes"> 
  </div>
  
  </div>
`

/*
 * Define custom element.
 */
customElements.define('my-sockets-messages',
  /**
   * Represents a messenger that uses web sockets
   */
  class extends HTMLElement {
    /**
     * The message box element.
     *
     * @type {HTMLDivElement}
     */
    #messagesBox
    #picker
    /**
     * Web socket.
     */
    #socket
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Get the message box element in the shadow root.
      this.#messagesBox = this.shadowRoot.querySelector('#messages_box')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.#startSocket(serverAdress)
      this.#startConversation()
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
      this.#socket.close()
      console.log('Socket Closed')
    }

    /**
     * Creates a new web socket connection to the specified server address.
     *
     * @param {string} servAdress - The server address to connect to.
     */
    #startSocket (servAdress) {
      this.#socket = new window.WebSocket(servAdress)

      this.#socket.addEventListener('open', event => {
        console.log('Connected to server')
      })
    }

    /**
     * Listens for incoming messages from the server and appends them to the message box.
     */
    #getMessages () {
      this.#socket.addEventListener('message', event => {
        console.log('Received message: ', event.data)
        try {
          const message = JSON.parse(event.data)
          if (message.username !== 'The Server') {
            const pElement = document.createElement('p')
            pElement.textContent += `${message.username}: `
            pElement.innerHTML += DOMPurify.sanitize(message.data) // Sanitize incoming message
            this.#messagesBox.querySelector('my-message')
            this.#messagesBox.firstElementChild.appendChild(pElement)
            pElement.scrollIntoView()
          }
          // Validate text other people
        } catch (error) {
          console.error(error)
        }
      })
    }

    /**
     * Sends a message to the server through the web socket connection.
     */
    #sendMessages () {
      console.log(dataToSend)
      // Send message
      this.#socket.send(JSON.stringify(dataToSend))
    }

    /**
     * Creates and appends the input field for messages.
     */
    #startConversation () {
      const username = localStorage.getItem('username')
      if (!username) {
        const usernameForm = document.createElement('my-username')
        this.#messagesBox.appendChild(usernameForm)
        this.#messagesBox.addEventListener('submitedUsername', (event) => {
          dataToSend.username = event.detail
          localStorage.setItem('username', dataToSend.username)
          this.#messagesBox.removeChild(usernameForm)

          this.#makeMessageinput()

          this.#getMessages()
        })
      } else {
        // Set username in data
        console.log(username)
        dataToSend.username = username

        this.#makeMessageinput()

        this.#getMessages()
      }
    }

    /**
     * Creates a message input field and adds it to the messages box.
     */
    #makeMessageinput () {
      const enterMessage = document.createElement('my-message')
      enterMessage.setAttribute('id', 'messageInput')
      this.#messagesBox.appendChild(enterMessage)
      this.#messagesBox.addEventListener('submitedMessage', (event) => {
        dataToSend.data = event.detail
        this.#sendMessages()
      })
    }
  }
)
