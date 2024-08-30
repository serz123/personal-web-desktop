/**
 * The my-recorder web component.
 *
 * @author Vanja Maric <vm222hx@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
  <style>
  button {
      width: 50px;
      padding 10 px;
      height: 50px;
      border-radius: 50%;
    }
  </style>
  <div id="container">
  <p id="status"><p/>
  <button id="startButton">Start</button>
  <button id="stopButton">Stop</button>
  <button id="playButton">Play</button>
  </div>
`

customElements.define('my-recorder',
  /**
   * Represents a my-recorder element.
   */
  class extends HTMLElement {
    /**
     * The div element.
     *
     * @type {*}
     */
    #container

    /**
     * The p element.
     *
     * @type {*}
     */
    #status

    /**
     * The button element.
     *
     * @type {*}
     */
    #startBtn

    /**
     * The button element.
     *
     * @type {*}
     */
    #stopBtn

    /**
     * The button element.
     *
     * @type {*}
     */
    #playBtn

    /**
     * The audio stream object.
     *
     * @type {MediaStream}
     */
    #audioStream

    /**
     * The audio context object.
     *
     * @type {AudioContext}
     */
    #audioCtx = new (window.AudioContext || window.AudioContext)()

    /**
     * Array to store audio data chunks.
     *
     * @type {Blob[]}
     */
    #chunks = []

    /**
     * MediaRecorder object for recording audio.
     *
     * @type {MediaRecorder}
     */
    #mediaRecorder

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
      this.#container = this.shadowRoot.querySelector('#container')
      this.#status = this.shadowRoot.querySelector('#status')
      this.#startBtn = this.shadowRoot.querySelector('#startButton')
      this.#stopBtn = this.shadowRoot.querySelector('#stopButton')
      this.#playBtn = this.shadowRoot.querySelector('#playButton')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.#connect()
      this.#stopBtn.disabled = true // disable stop button
      this.#playBtn.disabled = true // disable play button
      this.#startBtn.addEventListener('click', () => this.#startReceivingAudio())
      this.#stopBtn.addEventListener('click', async () => this.#stopReceivingAudio())
      this.#playBtn.addEventListener('click', this.#playRecording)
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
      // Get the tracks associated with the audio stream
      const tracks = this.#audioStream.getTracks()

      // Stop capturing audio for each track
      tracks.forEach(track => track.stop())
    }

    /**
     * Connects to the user's audio input device.
     */
    async #connect () {
      try {
        this.#audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch (error) {
        console.log('Cannot acces to the microphone!', error)
        this.#setStatus('Cannot acces to the microphone. Check if your microphone is turned on!')
      }
    }

    /**
     * Sets the status text of the component.
     *
     * @param {string} message - The message to set as the status text.
     */
    #setStatus (message) {
      this.#status.textContent = message
    }

    /**
     * Starts receiving audio from the microphone and recording it.
     */
    #startReceivingAudio () {
      this.#chunks = []
      const stream = this.#audioStream
      this.#audioCtx.createMediaStreamSource(stream)
      this.#setStatus('Listening...')
      this.#mediaRecorder = new MediaRecorder(stream)
      this.#mediaRecorder.addEventListener('dataavailable', (event) => this.#handleDataAvailable(event))
      this.#audioCtx.resume()
      this.#mediaRecorder.start()
      this.#setStatus('Recording...')
      this.#stopBtn.disabled = false

      console.log('Started recording')
    }

    /**
     * Stops receiving audio from the microphone and finishes recording.
     */
    #stopReceivingAudio () {
      this.#stopBtn.addEventListener('click', async () => {
        this.#mediaRecorder.stop()
        this.#setStatus('Finishing recording...')

        console.log('Stopped recording')
        console.log('Chunks:', this.#chunks)

        // Create a promise for each chunk and store in an array
        const chunkPromises = this.#chunks.map(chunk => new Promise(resolve => resolve(chunk)))

        // Wait for all promises to resolve before continuing
        await Promise.all(chunkPromises)

        console.log(this.#chunks)
        this.#setStatus('Recording finished')
        this.#playBtn.disabled = false
      })
    }

    /**
     * Handles the data available event by storing the data in the chunks array.
     *
     * @param {event} event - The event containing the data.
     */
    #handleDataAvailable (event) {
      this.#chunks.push(event.data)
      this.#playBtn.disabled = false
    }

    /**
     * Plays back the recording.
     */
    #playRecording = () => {
      console.log(this.#chunks)
      const blob = new Blob(this.#chunks, { type: 'audio/webm' })
      const reader = new FileReader()
      reader.readAsArrayBuffer(blob)
      /**
       * Handles the loaded file data by decoding it and playing back the audio.
       */
      reader.onloadend = () => {
        this.#audioCtx.decodeAudioData(reader.result, (buffer) => {
          const source = this.#audioCtx.createBufferSource()
          source.buffer = buffer
          source.connect(this.#audioCtx.destination)
          source.start()
        })
      }
    }
  }
)
// AND ELEMENTS MOVING AT DESKTOP WIERD when mic is on
// FAILED CODE TO ASK
/*   #compareSound = async () => {
      const blob = new Blob(this.#chunks, { type: 'audio/webm' })
      // Create a new FileReader object to read the Blob
      const reader = new FileReader();

      // Read the Blob as an ArrayBuffer
      reader.readAsArrayBuffer(blob);

      // Wait for the reader to finish reading the data
      await new Promise((resolve) => {
        reader.addEventListener('loadend', resolve)
      })

      // Decode the audio data using the Web Audio API
      const audioBuffer = await this.#audioCtx.decodeAudioData(reader.result);

      // Create a new AnalyserNode to extract frequency data from the audio
      const analyserNode = this.#audioCtx.createAnalyser();
      analyserNode.fftSize = 2048;

      // Connect the AudioBufferSourceNode to the AnalyserNode
      const sourceNode = this.#audioCtx.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(analyserNode);
      sourceNode.connect(this.#audioCtx.destination);

      // Create an array to hold the frequency data
      const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

      // Get the frequency data and determine the dominant frequency
      analyserNode.getByteFrequencyData(dataArray);
      console.log(dataArray)
      const peak = Math.max(...dataArray);
      const index = dataArray.indexOf(peak);
      const frequency = this.#audioCtx.sampleRate / analyserNode.fftSize * index;

      // Compare the frequency to the frequency of an A note (440Hz)
      const tolerance = 10; // Hz
      console.log(frequency)
      if (Math.abs(frequency - 440) <= tolerance) {
        console.log('The recorded sound is an A note.');
      } else {
        console.log('The recorded sound is not an A note.');
      }
    }
  }
) */
