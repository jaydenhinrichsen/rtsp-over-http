# rtsp-over-http
Send FFMPEG output from RTSP streams to the browser using Socket.io & Express.js

## Installation
In order to use this package you'll need to have Express.js and Socket.io installed as dependencies in your project, as this package does not include them.

In the root directory of your project, run the following command
``` sh
npm install express socket.io
```

Additionally, you'll need to have FFMPEG install on your machine and it must be globally accessible(available in your environment/path variables if on Windows).

For help on installing FFMPEG on windows check out this Stack Exchange post:
[How do I set up and use ffmpeg in Windows?](https://video.stackexchange.com/questions/20495/how-do-i-set-up-and-use-ffmpeg-in-windows)

## Usage
``` javascript
const streams = [
  {
    name: "Test",
    url: `rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov`,
    videoOpts: "-s 240x160 -b:v 1000k -r 30" // Any additional video options for FFMPEG
  }
];

const StreamManager = require("rtsp-over-http")({
  app: your_express_app,
  wss: your_socket.io_server,
  port: 3000, // The port your Express app is listening on
  streams
});
```

A more detailed example can be found in the repository.

## Future Features
- Only video channels are supported as of right now, but I plan to add support for audio channels in the future.

## Shoutouts
The biggest inspiration came from [@moeiscool](https://github.com/moeiscool) from Shinobi Video. 
He did a lot of the heavy lifting and I used his basic idea as well as some of his code from this gist:
[FFMPEG to Web Browser with Express, Socket.IO and JSMPEG](https://gist.github.com/moeiscool/e2a584cca6f4e3f1691a96b6c56856f9).

I mainly just wanted an easy way to setup this up in existing/future projects, and I figured there might be some people out there who are looking for something similar.
