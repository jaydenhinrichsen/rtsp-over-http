/**
 * A few things to note:
 * This package does not come with socket.io or express.js dependencies, however,
 * you will need to have those dependencies installed in order to use this package.
 *
 * Additionaly, you will also need to have ffmpeg installed on your machine
 * and must be accessible globally(available in your environment variables/path).
 *
 * For help on installing FFMPEG on windows check out this Stack Exchange post:
 * https://video.stackexchange.com/questions/20495/how-do-i-set-up-and-use-ffmpeg-in-windows
 *
 */

/**
 * -------------------------------------------------------------------------
 * Some basic boilerplate required to demonstrate the example.
 * In your project, this will likely have been done already so you can
 * move on to the next section.
 * -------------------------------------------------------------------------
 */
const app = require("express")();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
const server = require("http").createServer();
const wss = require("socket.io")(server);

server.on("request", app);
server.listen(3000, () => console.log(`http server listening on port 3000`));

/**
 * -------------------------------------------------------------------------
 * Using this package.
 * -------------------------------------------------------------------------
 */

const streams = [
  {
    name: "Test",
    url: `rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov`,
    videoOpts: "-s 240x160 -b:v 1000k -r 30"
  }
];

const StreamManager = require("../index")({
  app,
  wss: wss,
  port: 3000,
  streams
});
