/**
 * The my-username web component module.
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
    </style>
  <form id="form"><input type="text" class="user" placeholder="Enter your username"/> 
  <input type="submit" class="user" id="set" value="Set" /></form>
`

customElements.define('my-username',
  /**
   * Represents a my-username element.
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
      this.#form = this.shadowRoot.querySelector('form')
      this.#form.addEventListener('submit', (event) => {
        if (this.#input.value !== '') {
          this.#onSubmit(event)
        } else {
          event.preventDefault()
        }
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
    }

    /**
     * Handles submit event - saves the username.
     *
     * @param {SubmitEvent} event - The submit event.
     */
    #onSubmit (event) {
      // Do not submit the form!
      event.preventDefault()
      // Skapa händelse som utlöser händelsen answer
      this.dispatchEvent(new window.CustomEvent('submitedUsername', {
        detail: this.#input.value,
        bubbles: true
      }))
    }
  }
)
