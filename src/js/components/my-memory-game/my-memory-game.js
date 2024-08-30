/**
 * The my-memory-game web component module.
 *
 * @author Vanja Maric <vm222hx@student.lnu.se>
 * @version 1.1.2
 */

// This code is based on code from the following project:
// https://gitlab.lnu.se/1dv025/content/exercises/module-b/exercise-memory-game/-/tree/solution/
//
// Author: Mats Loock <mats.loock@lnu.se>
// The original code is licensed under the MIT license.
// Copyright (c) 2020 Original Author
//
// Modified by [Vanja Maric] for use in [Assigment B3 - PWD]
// [Assigment B3 - PWD] is licensed under the [MIT].

import '../my-flipping-tile'
import '../my-timer'

const numOfImgs = 8
const backgroundImage = (new URL('images/0.png', import.meta.url)).href
const images = []
for (let i = 1; i <= numOfImgs; i++) {
  images[i] = (new URL(`./images/${i}.png`, import.meta.url)).href
}

// Define template.
const template = document.createElement('template')
template.innerHTML = `<style>  :host {
      --tile-size: 80px; 
      --tile-size2: 120px
    }
    #game {
      display: grid;
      grid-template-columns: repeat(2, var(--tile-size));
      gap: 20px;
    }
    #game.large {
      grid-template-columns: repeat(4, var(--tile-size));
    }
    my-flipping-tile {
      width: var(--tile-size);
      height: var(--tile-size2);
    }
    my-flipping-tile::part(tile-back) {
      border-width: 5px;
      background: url("${backgroundImage}") no-repeat center/100%, radial-gradient(#faebd7, #c44f4ff5);
    }
    button {
      background:no-repeat center/100%, radial-gradient(#faebd7, #c44f4ff5);
      border-radius: 50%;
    }
</style>
 <template id="tile-template">
    <my-flipping-tile>
      <img />
    </my-flipping-tile>
 </template>
  <div id="game">
  <button id="small" type="button">2x2</button> 
  <button id="medium" type="button">4x2</button> 
  <button id="large" type="button">4x4</button> 
  </div>
`

customElements.define('my-memory-game',
  /**
   * Represents a memory game.
   */
  class extends HTMLElement {
    /**
     * The element representing the game.
     */
    #game
    /**
     * The tile template element.
     *
     * @type {HTMLTemplateElement}
     */
    #tileTemplate

    #interval
    #spentTime
    #attempts = 0
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Get the tile element in the shadow root.
      this.#game = this.shadowRoot.querySelector('#game')

      // Get the tile template element in the shadow root.
      this.#tileTemplate = this.shadowRoot.querySelector('#tile-template')
    }

    /**
     * Gets the board size.
     *
     * @returns {string} The size of the game board.
     */
    get boardSize () {
      return this.getAttribute('boardsize')
    }

    /**
     * Sets the board size.
     *
     * @param {string} value - The size of the game board.
     */
    set boardSize (value) {
      this.setAttribute('boardsize', value)
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['boardsize']
    }

    /**
     * Get the game board size dimensions.
     *
     * @returns {object} The width and height of the game board.
     */
    get #gameBoardSize () {
      const gameBoardSize = {
        width: 2,
        height: 2
      }

      switch (this.boardSize) {
        case 'large': {
          gameBoardSize.height = 4
          gameBoardSize.width = 4
          break
        }

        case 'medium': {
          gameBoardSize.height = 4
          break
        }
      }

      return gameBoardSize
    }

    /**
     * Get all tiles.
     *
     * @returns {object} An object containing grouped tiles.
     */
    get #tiles () {
      const tiles = Array.from(this.#game.children)
      return {
        all: tiles,
        faceUp: tiles.filter(tile => tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        faceDown: tiles.filter(tile => !tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        hidden: tiles.filter(tile => tile.hasAttribute('hidden'))
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      if (!this.hasAttribute('boardsize')) {
        this.#pickGame()
      }

      this.#upgradeProperty('boardsize')

      this.#game.addEventListener('my-flipping-tile:flip', () => {
        this.#onTileFlip()
      })
      this.addEventListener('dragstart', (event) => {
        // Disable element dragging.
        event.preventDefault()
        event.stopPropagation()
      })
      this.#gameOver()
    }

    /**
     * Picks size of the game.
     */
    #pickGame () {
      const smallButton = this.#game.querySelector('#small')
      const mediumButton = this.#game.querySelector('#medium')
      const largeButton = this.#game.querySelector('#large')

      smallButton.addEventListener('click', (event) => {
        this.#makeGame(event)
      })

      mediumButton.addEventListener('click', (event) => {
        this.#makeGame(event)
      })

      largeButton.addEventListener('click', (event) => {
        this.#makeGame(event)
      })
    }

    /**
     * Creates a new game by removing all previous game elements, starting the timer and setting the board size based on the event target id.
     *
     * @param {Event} ev The event object that triggered the function call.
     */
    #makeGame (ev) {
      while (this.#game.firstElementChild) {
        this.#game.removeChild(this.#game.lastElementChild)
      }
      this.#timeCount()
      this.setAttribute('boardsize', ev.target.id)

      ev.stopPropagation()
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'boardsize') {
        this.#init()
      }
    }

    /**
     * Run the specified instance property through the class setter.
     *
     * @param {string} prop - The property's name.
     */
    #upgradeProperty (prop) {
      if (Object.hasOwnProperty.call(this, prop)) {
        const value = this[prop]
        delete this[prop]
        this[prop] = value
      }
    }

    /**
     * Initializes the game board size and tiles.
     */
    #init () {
      const { width, height } = this.#gameBoardSize

      const tilesCount = width * height

      if (tilesCount !== this.#tiles.all.length) {
        // Remove existing tiles, if any.
        while (this.#game.firstChild) {
          this.#game.removeChild(this.#game.lastChild)
        }

        if (height === 4) {
          this.#game.classList.add('large')
        } else {
          this.#game.classList.remove('large')
        }

        // Add tiles.
        for (let i = 0; i < tilesCount; i++) {
          const tile = this.#tileTemplate.content.cloneNode(true)
          this.#game.appendChild(tile)
        }
      }

      const indexes = [...Array(tilesCount).keys()]

      for (let i = indexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]]
      }

      // Set the tiles' images.
      this.#tiles.all.forEach((tile, i) => {
        tile.querySelector('img').setAttribute('src', images[indexes[i] % (tilesCount / 2) + 1])
        tile.faceUp = tile.disabled = tile.hidden = false
      })
    }

    /**
     * Handles flip events.
     */
    #onTileFlip () {
      const tiles = this.#tiles
      const tilesToDisable = Array.from(tiles.faceUp)

      if (tiles.faceUp.length > 1) {
        this.#attempts += 1
        tilesToDisable.push(...tiles.faceDown)
      }

      tilesToDisable.forEach(tile => (tile.setAttribute('disabled', '')))

      const [first, second, ...tilesToEnable] = tilesToDisable

      if (second) {
        const isEqual = first.isEqual(second)
        const delay = isEqual ? 1000 : 1500
        const tmOut = window.setTimeout(() => {
          let eventName = 'memory-game:tiles-mismatch'
          if (isEqual) {
            first.setAttribute('hidden', '')
            second.setAttribute('hidden', '')
            eventName = 'memory-game:tiles-match'
          } else {
            first.removeAttribute('face-up')
            second.removeAttribute('face-up')
            tilesToEnable.push(first, second)
          }

          this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: { first, second }
          }))

          if (tiles.all.every(tile => tile.hidden)) {
            tiles.all.forEach(tile => (tile.disabled = true))
            this.#game.dispatchEvent(new CustomEvent('memory-game:game-over', {
              detail: this.#attempts,
              bubbles: true
            }))

            clearTimeout(tmOut)
          } else {
            tilesToEnable?.forEach(tile => (tile.removeAttribute('disabled')))
          }
        }, delay)
      }
    }

    /**
     * Count the time.
     *
     */
    #timeCount () {
      let seconds = 0
      this.#interval = setInterval(() => {
        seconds += 1
        this.#spentTime = this.#timeForm(seconds)
      }, 1000)
    }

    /**
     * Makes form for time.
     *
     * @param {number} time - Number of seconds to convert to desierable time format.
     * @returns {string} - Time in mm:ss format.
     */
    #timeForm (time) {
      const min = Math.floor(time / 60)
      let sec = time % 60
      if (sec < 10) {
        sec = `0${sec}`
      }
      return `${min}:${sec}`
    }

    /**
     * Ends the game and starts new game.
     */
    #gameOver () {
      this.#game.addEventListener('memory-game:game-over', event => {
        clearInterval(this.#interval)
        while (this.#game.firstElementChild) {
          this.#game.removeChild(this.#game.firstElementChild)
        }
        const result1 = document.createElement('p')
        result1.textContent = 'GOOD JOB!'
        this.#game.appendChild(result1)
        const result = document.createElement('p')
        result.textContent = `MOVES: ${this.#attempts}`
        this.#game.appendChild(result)
        const result2 = document.createElement('p')
        result2.textContent = `TIME: ${this.#spentTime}`
        this.#game.appendChild(result2)
        const newGameBtn = document.createElement('button')
        newGameBtn.setAttribute('id', 'newGame')
        newGameBtn.setAttribute('type', 'button')
        newGameBtn.textContent = 'NEW GAME'
        this.#game.appendChild(newGameBtn)
        this.#startAgain(newGameBtn)
      })
    }

    /**
     * Starts new game.
     *
     * @param {HTMLElement} btn - The new game button element.
     */
    #startAgain (btn) {
      btn.addEventListener('click', () => {
        this.#game.innerHTML = ` 
          <button id="small" type="button">2x2</button> 
          <button id="medium" type="button">4x2</button>
          <button id="large" type="button">4x4</button>`
        this.#pickGame()
      })
    }
  }
)
// Count drags
// Iplement extra feature
/*  */
