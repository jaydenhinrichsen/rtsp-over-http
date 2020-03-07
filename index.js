const { EventEmitter } = require("events");
const Stream = require("./Stream");
/**
    Basic idea is as follows:
      1. FFMPEG child process receives an RTSP stream
      2. FFMPEG output is sent to an express endpoint on this server(http://localhost:5000/streams/:stream).
      3. When the endpoint receives some data from FFMPEG it is emited a Socket.io room
 */

class StreamManager extends EventEmitter {
  constructor({ wss, app, streams, port }) {
    super();
    this.wss = wss;
    this.port = port;
    this.app = app;
    this.streams = this._makeStreams(streams);
    this.emitters = {};

    this.wss.on("connection", this._handleConnection.bind(this));
    app.all("/streams/:stream", this._emitStream.bind(this));
  }

  _emitStream(req, res) {
    req.emitter = this._initEmitter(req.params.stream);
    req.connection.setTimeout(0);
    req.on("data", buffer => {
      req.emitter.emit("data", buffer);
      this.wss.to(req.params.stream).emit("h264", buffer);
    });
    req.on("end", () => {
      console.log("close");
    });
  }

  /**
   * @description
   * Handles a websocket connection and the commands it sends(stop, start, etc)
   * @param {Websocket} ws
   */
  _handleConnection(ws) {
    ws.on("stream", data => {
      // Join stream
      if (data.action === "join") {
        if (this.streams[data.stream]) {
          console.log(`A socket joined ${data.stream}`);
          ws.stream = data.stream;
          ws.join(data.stream);

          if (!this.streams[data.stream].isPlaying) {
            this.streams[data.stream].start();
            console.log("This socket was the first one, starting the stream..");
          }
        } else {
          console.log("This stream doesn't exist...?"); // Should never happen
        }
        // Leave stream
      } else if (data.action === "leave") {
        ws.leave(data.stream);

        console.log(`A socket left ${data.stream}`);
      }
    });

    ws.on("close", () => {
      // Check to see if there are any connected websockets for this stream
      // If not, close the stream
    });
  }

  /**
   * @private
   * @description Instantiate the streams that were passed in the constructor
   * @param {Array} streams
   */
  _makeStreams(streams) {
    let _streams = {};
    streams.forEach(stream => {
      _streams[stream.name] = new Stream({ ...stream, port: this.port });
    });

    return _streams;
  }

  /**
   *
   * @param {String} feed
   */
  _initEmitter(stream) {
    if (!this.emitters[stream]) {
      this.emitters[stream] = new EventEmitter().setMaxListeners(0);
    }
    return this.emitters[stream];
  }
}

module.exports = props => new StreamManager(props);
