const child_process = require("child_process");
class Stream {
  constructor({ url, name, port, videoOpts }) {
    this.url = url;
    this.name = name;
    this.port = port;
    this.videoOpts = videoOpts ? videoOpts + " " : "";

    this.ffmpeg = null;
    this.isPlaying = false;
  }

  /**
   * @description
   * Spawn an FFMPEG child process with input as the RTSP stream url
   * and the output as the stream endpoint.
   */
  start() {
    this.isPlaying = true;
    const opts = `-rtsp_transport tcp -i ${this.url} -f mpegts -c:v mpeg1video ${this.videoOpts}-an http://localhost:${this.port}/streams/${this.name}`;

    this.ffmpeg = child_process.spawn("ffmpeg", opts.split(" "));
    this.ffmpeg.on("close", function(buffer) {
      console.log("ffmpeg died");
    });
  }
  stop() {
    this.ffmpeg.kill("SIGKILL");
  }
}

module.exports = Stream;
