const {projectionInPlane, subVector, crossProductVector, addVector, mulScalarVector, distance} = require('./lib');

const body = document.getElementsByTagName('body');

const width = 500, height = 250;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;

body[0].appendChild(canvas);


function createFace(points, color) {
  return {points, color};
}

const faces = [
  createFace([{x: 1, y: 1, z: 0}, {x: 1, y: 0, z: 1}, {x: 0, y: 1, z: 1}], {r: 255, g: 0, b: 0, a: 255}),
  createFace([{x: 0, y: 0, z: 0}, {x: 3, y: 0, z: 0}, {x: 0, y: 0, z: 3}], {r: 0, g: 255, b: 0, a: 255}),
  createFace([{x: 10, y: 5, z: 0}, {x: 0, y: 5, z: 10}, {x: 0, y: 5, z: -10}], {r: 0, g: 255, b: 255, a: 255}),
  createFace([{x: -10, y: 5, z: 0}, {x: 0, y: 5, z: 10}, {x: 0, y: 5, z: -10}], {r: 0, g: 255, b: 255, a: 255}),
];

let times=0

function print(v = null) {
  if (times<100) {
    times++;
    console.log((v ? v : '') + new Date().getTime())
  }
}

function drawObjects(pointToLook, camPos) {
  const image = ctx.createImageData(width, height);
  const directionVector = subVector(pointToLook, camPos);

  const upVector = {x: 1, y: 0, z: 0};
  let trans = crossProductVector(upVector, directionVector);
  let trans2 = crossProductVector(trans, directionVector);
  trans = mulScalarVector(0.7, trans)
  const ref = distance(trans2) / distance(trans)
  trans2 = mulScalarVector(1 / ref, trans2);

  const black = {r: 0, g: 0, b: 0, a: 255};

  const hMiddle = Math.floor(height / 2);
  const wMiddle = Math.floor(width / 2);

  let pp = 0;
  for (let j = 0; j < height; j++) {
    const sh = j - hMiddle;
    for (let i = 0; i < width; i++) {
      const sw = i - wMiddle;

      let si = 0;
      let minDis = 9999999999;
      for (let i1 = 0; i1 < faces.length; i1++) {
        let face = faces[i1].points;
        // const rayPos = addVector(addVector(direction, mulScalarVector(sw / wMiddle, trans)), mulScalarVector(sh / hMiddle, trans2));
        const rayPos = addVector(addVector(pointToLook, mulScalarVector(sw / wMiddle, trans)), mulScalarVector(sh / hMiddle, trans2));
        // console.log(rayPos)
        const proj = projectionInPlane(face, camPos, subVector(rayPos, camPos));
        if (proj.collide && minDis > proj.distance) {
          si = faces[i1].color;
          if (proj.isBorder) {
            si = black;
          }
        }
      }
      image.data[pp] = si.r;
      image.data[pp + 1] = si.g;
      image.data[pp + 2] = si.b;
      image.data[pp + 3] = si.a;
      pp += 4;
    }
  }

  ctx.putImageData(image, 0, 0);
}

let camPos = {x: 15, y: 15, z: 15};

function rotate(pos, ang) {
  return {
    x: pos.x * Math.cos(ang) + pos.z * Math.sin(ang),
    y: pos.y,
    z: - pos.x * Math.sin(ang) + pos.z * Math.cos(ang),
  }
}

function start() {
  camPos = rotate(camPos, Math.PI / 10);
  print(JSON.stringify(camPos))

  const pointToLook = {x: 0, y: 0, z: 0};

  drawObjects(pointToLook, camPos);
}

let lastTime = 0;
const intervalPerSecond = 1000 / 30;

function loop(currentTime) {
  if (intervalPerSecond <= currentTime - lastTime) {
    lastTime = currentTime;
    start();
  }
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
