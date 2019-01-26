
var cv = require('opencv4nodejs');

const grabFrames = (videoFile, delay, onFrame) => {
  const cap = new cv.VideoCapture(videoFile);
  let done = false;
  const intvl = setInterval(() => {
    let frame = cap.read();
    // loop back to start on end of stream reached
    if (frame.empty) {
      cap.reset();
      frame = cap.read();
    }
    onFrame(frame);
    const key = cv.waitKey(delay);
    done = key !== -1 && key !== 255;
    if (done) {
      clearInterval(intvl);
      console.log('Key pressed, exiting.');
    }
  }, 0);
};

var code = cv.VideoWriter.fourcc('MJPG');
var file = 'video.avi';
var fps = 24;
var writer = new cv.VideoWriter(file, code, fps, new cv.Size(640, 480));

var delay = 24;
grabFrames('/dev/video0', delay, (frame) => {
  //console.log(frame)
  writer.write(frame)
  cv.imshow('frame', frame)
})

process.on('SIGINT', function () {
  console.log('release video')
  writer.release()
  process.exit(0)
})
