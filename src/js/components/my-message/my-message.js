import { Picker } from 'emoji-mart'

/**
 * The my-message web component module.
 *
 * @author Vanja Maric <vm222hx@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style> 
  .user {
      height: 35px;
      font-size: 20px;
      margin: 10px;
    }
  .hidden{
    visibility: hidden;
  }  
  #emoji-picker {
  position: absolute;
  top: 0;
  left: 0;
}
#set {
  font-size: 0.90em;
  height: 25px;
  width: 70px;
 margin: 5px;
  float: left;
}
#emoji-button {
  float: right;
  width: 70px;
  font-size:  0.90em;
  height: 25px;
  display: inline-block;
  margin: 5px;
}
</style>
  <div id="container">
  <div id="emoji-picker" hidden=""></div>
  <form id="form"><input type="text" class="user" placeholder="Enter your message"/> 
  <input type="submit" class="user" id="set" value="Send" /></form>
  <button id="emoji-button">Emojis</button>
  </div>
`

customElements.define('my-message',
  /**
   * Represents a my-message element.
   */
  class extends HTMLElement {
    /**
     * The input element.
     *
     * @type {*}
     */
    #input

    /**
     * The form element.
     *
     * @type {*}
     */
    #form

    /**
     * The container element.
     *
     * @type {*}
     */
    #container

    /**
     * The emoji picker instance.
     *
     * @type {Picker}
     */
    #picker

    /**
     * The emoji button element.
     *
     * @type {*}
     */
    #emojiButton

    /**
     * The emoji picker container element.
     *
     * @type {*}
     */
    #emojiDiv

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Get the elements in the shadow root.
      this.#input = this.shadowRoot.querySelector('input[type="text"]')
      this.#container = this.shadowRoot.querySelector('#container')
      this.#emojiDiv = this.shadowRoot.querySelector('#emoji-picker')
      this.#form = this.shadowRoot.querySelector('form')
      this.#emojiButton = this.shadowRoot.querySelector('#emoji-button')
      this.#form.addEventListener('submit', (event) => {
        if (this.#input.value !== '') {
          this.#onSubmit(event)
        } else {
          event.preventDefault()
        }
      })

      this.#emojiButton.addEventListener('click', () => {
        this.#showEmojies()
      })

      this.#emojiDiv.addEventListener('emojiSelected', (event) => {
        const start = this.#input.selectionStart
        const end = this.#input.selectionEnd
        const text = this.#input.value
        const emoji = event.detail.explicitOriginalTarget.textContent
        this.#input.value = text.slice(0, start) + emoji + text.slice(end)
      })
    }

    /**
     * Focus input element.
     */
    focus () {
      this.#input.focus()
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.focus()
      this.#getEmojis()
    }

    /**
     * Initializes the emoji picker.
     *
     */
    #getEmojis () {
      // Initialize the emoji picker with
      this.#picker = new Picker({
        emojiSize: 24
      })
      this.#picker.addEventListener('click', (emoji) => {
        this.#hideEmojis()
        this.#picker.dispatchEvent(new CustomEvent('emojiSelected', {
          detail: emoji,
          bubbles: true
        }))
      })
      this.#emojiDiv.appendChild(this.#picker)
    }

    /**
     * Hides the emoji picker.
     *
     */
    #hideEmojis () {
      this.#emojiDiv.setAttribute('hidden', '')
    }

    /**
     * Shows the emoji picker.
     *
     */
    #showEmojies () {
      this.#emojiDiv.removeAttribute('hidden')
    }

    /**
     * Handles submit event - saves the message.
     *
     * @param {SubmitEvent} event - The submit event.
     */
    #onSubmit (event) {
      // Do not submit the form!
      event.preventDefault()
      // Skapa händelse som utlöser händelsen answer
      this.dispatchEvent(new window.CustomEvent('submitedMessage', {
        detail: this.#input.value,
        bubbles: true
      }))
      this.#input.value = ''
    }
  }
)
