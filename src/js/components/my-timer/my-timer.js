/**
 * The my-timer web component module.
 *
 * @author // Vanja Maric <vm222hx@student.lnu.se>
 * @version 1.1.0
 */
const TIMER_IMG_URL = (new URL('./images/computer.png', import.meta.url)).href
// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
 #timer {
  padding-top: 23px;
 
  text-align: center;
      width: 63px;
      height: 47px;
      background-image: url(${TIMER_IMG_URL});
      background-repeat: no-repeat;
      background-position: center;
 }
</style>
  <div id="timer">
  </div>
`

customElements.define('my-timer',
  /**
   * Represents a my-timer element.
   */
  class extends HTMLElement {
    /**
     * The timer element.
     *
     * @type {HTMLDivElement}
     */
    #timerElement

    #spentTime

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#timerElement = this.shadowRoot.querySelector('#timer')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.#startTimer()
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.stopTimer()
    }

    /**
     * Count the time.
     */
    #timeCount () {
      let seconds = 0
      setInterval(() => {
        seconds += 1
        this.#timeForm(seconds)
      }, 1000)
    }

    /**
     * Make form for time.
     *
     * @param {number} time - Time to count down.
     */
    #timeForm (time) {
      const min = Math.floor(time / 60)
      let sec = time % 60
      if (sec < 10) {
        sec = `0${sec}`
      }
      this.#spentTime = `${min}:${sec}`
      this.#timerElement.innerText = this.#spentTime
    }

    /**
     * Starts the timer.
     */
    #startTimer () {
      this.#timeCount()
    }

    /**
     * Stops the timer.
     */
    stopTimer () {
      this.dispatchEvent(new window.CustomEvent('timerstopped', {
        detail: this.#spentTime,
        bubbles: true
      }))
    }
  }
)
