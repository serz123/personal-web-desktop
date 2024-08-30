/**
 * The my-dock-window web component module.
 *
 * @author Vanja Maric <vm222hx@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  #frame { 
    position: absolute;
    z-index: 100;
    min-width: 200px;
    height: 300px;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 1fr 13fr;
    grid-template-areas: 
    "first"
    "second";
  }  
   #first {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    grid-area: first;
    background-color: lightblue;
    display: grid;
    grid-template-columns: 80% 20%;
    grid-template-rows: 100%;
    grid-template-areas: 
    "name close";
  }
  #second {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: #f5f5f5;
    grid-area: second;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #name {
   grid-area: name;
  }
  #close {
    border-radius: 20%;
    background-color: coral;
    box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.2), 0 0 10px rgba(0, 0, 0, 0.2);
    perspective: 1000px;
    grid-area: close;
    height: 100%;
    cursor: pointer;
  }
</style>
<div id="frame" draggable="false">
<div id="first"> 
<p id="namePlace">App name</p>
<button id="close" type="button">X</button> 
</div>
<div id="second"></div>
</div>
`

customElements.define('my-dock-window',
  /**
   * Represents a my-dock-window element.
   */
  class extends HTMLElement {
    /**
     * The div element.
     *
     * @type {HTMLDivElement}
     */
    #frameEl

    /**
     * The subapp to be placed in the window frame.
     *
     * @type {*}
     */
    #app

    /**
     * The name to be placed in the window frame.
     *
     * @type {string}
     */
    #name

    /**
     * Makes the frame element draggable.
     */
    #cloneEl = null

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
      this.#frameEl = this.shadowRoot.querySelector('#frame')
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['app', 'name']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'app' && oldValue !== newValue) {
        this.#app = newValue
      }
      if (name === 'name' && oldValue !== newValue) {
        this.#name = newValue
      }
    }

    /**
     * Called when the custom element is added to the DOM.
     */
    connectedCallback () {
      this.#setWindowName(this.#name)
      this.#dragFrame()
      this.#closeEvent()
      this.#placeAppInWindow(this.#app)
    }

    /**
     * Setts the name of the subap that is placed in the dock window.
     *
     * @param {*} appName the name of the subapp.
     */
    #setWindowName (appName) {
      const namePelement = this.#frameEl.querySelector('#namePlace')
      namePelement.textContent = appName
    }

    /**
     * Closing the window.
     */
    #closeEvent () {
      const buttonEl = this.#frameEl.querySelector('#close')
      buttonEl.addEventListener('click', () => {
        buttonEl.dispatchEvent(new Event('closeWindow', {
          bubbles: true
        }))
      })

      this.#frameEl.addEventListener('closeWindow', () => {
        this.#frameEl.remove()
        this.dispatchEvent(new Event('removeEl', {
          bubbles: true
        }))
      })
    }

    /**
     * Makes the window dragable.
     */
    #dragFrame () {
      const firstDiv = this.#frameEl.querySelector('#first')
      const secondDiv = this.#frameEl.querySelector('#second')

      firstDiv.addEventListener('mousedown', () => {
        this.#frameEl.draggable = true
      })
      secondDiv.addEventListener('mousedown', () => {
        this.#frameEl.draggable = false
      })

      this.#frameEl.addEventListener('dragstart', (event) => {
        const offsetX = event.clientX - this.#frameEl.offsetLeft
        const offsetY = event.clientY - this.#frameEl.offsetTop
        event.dataTransfer.setData('text/plain', '')
        event.dataTransfer.setData('offsetX', offsetX)
        event.dataTransfer.setData('offsetY', offsetY)

        createClone()
      })

      /**
       * Removes the cloned element from the DOM if it exists.
       */
      const removeClone = () => {
        if (this.#cloneEl) {
          this.#cloneEl.remove()
          this.#cloneEl = null
        }
      }

      /**
       * Creates a clone of the frame element and appends it to document body.
       */
      const createClone = () => {
        removeClone()
        this.#cloneEl = this.#frameEl.cloneNode(true)
        this.#cloneEl.style.position = 'absolute'
        document.body.appendChild(this.#cloneEl)
      }

      this.#frameEl.addEventListener('drag', (event) => {
        const offsetX = event.dataTransfer.getData('offsetX')
        const offsetY = event.dataTransfer.getData('offsetY')
        this.#cloneEl.style.top = `${event.clientY - offsetY}px`
        this.#cloneEl.style.left = `${event.clientX - offsetX}px`
      })

      this.#frameEl.addEventListener('dragend', (event) => {
        const offsetX = event.dataTransfer.getData('offsetX')
        const offsetY = event.dataTransfer.getData('offsetY')
        this.#frameEl.style.top = `${event.clientY - offsetY}px`
        this.#frameEl.style.left = `${event.clientX - offsetX}px`

        removeClone()

        this.dispatchEvent(new Event('click', {
          bubbles: true
        }))
      })
    }

    /**
     * Place the sub application inside the frame element.
     *
     * @param {string} subApp The name of the sub application element to be placed inside the frame element.
     */
    #placeAppInWindow (subApp) {
      const frameDiv = this.#frameEl.querySelector('#second')
      const subaApplication = document.createElement(subApp)
      frameDiv.appendChild(subaApplication)
    }
  }
)
