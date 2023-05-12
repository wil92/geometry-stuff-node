function startRecording(canvas, stop) {
  const chunks = []; // here we will store our recorded media chunks (Blobs)
  // const stream = canvas.captureStream(); // grab our canvas MediaStream
  // const rec = new MediaRecorder(stream); // init the recorder
  const rec = new MediaRecorder(canvas.captureStream()); // init the recorder
  // every time the recorder has new data, we will store it in our array
  rec.ondataavailable = e => chunks.push(e.data);
  // only when the recorder stops, we construct a complete Blob from all the chunks
  rec.onstop = e => exportVid(new Blob(chunks, {type: 'image/'}));

  rec.start();
  setTimeout(() => {
    console.log(chunks)
    rec.stop();
    stop();
  }, 6000); // stop recording in 3s
}

function exportVid(blob) {
  const vid = document.createElement('video');
  vid.src = URL.createObjectURL(blob);
  vid.controls = true;
  document.body.appendChild(vid);
  const a = document.createElement('a');
  a.download = 'myvid.webm';
  a.href = vid.src;
  a.textContent = 'download the video';
  document.body.appendChild(a);
}

module.exports = {
  exportVid,
  startRecording
};
