const {projectionInPlane, subVector, crossProductVector, addVector, mulScalarVector, distance} = require('./lib');

const body = document.getElementsByTagName('body');

const width = 400, height = 200;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;

body[0].appendChild(canvas);

const camPos = {x: 10, y: 10, z: 10};
const direction = {x: 0, y: 0, z: 0};

const face = [{x: 1, y: 1, z: 0}, {x: 1, y: 0, z: 1}, {x: 0, y: 1, z: 1}];

const image = ctx.createImageData(width, height);
let pp = 0;
const upVector = {x: 1, y: 0, z: 0};
const directionVector = subVector(direction, camPos);
const trans = crossProductVector(upVector, directionVector);
let trans2 = crossProductVector(trans, directionVector);

const ref = distance(trans2)/distance(trans)
trans2 = mulScalarVector(1/ref, trans2);

const hMiddle = Math.floor(height / 2);
const wMiddle = Math.floor(width / 2);
for (let j = 0; j < height; j++) {
    const sh = j - hMiddle;
    for (let i = 0; i < width; i++) {
        const sw = i - wMiddle;

        // const rayPos = addVector(addVector(direction, mulScalarVector(sw / wMiddle, trans)), mulScalarVector(sh / hMiddle, trans2));
        const rayPos = addVector(addVector(direction, mulScalarVector(sw / wMiddle, trans)), mulScalarVector(sh / hMiddle, trans2));
        // console.log(rayPos)
        const proj = projectionInPlane(face, camPos, subVector(rayPos, camPos));
        const si = proj.collide;

        image.data[pp] = si ? 255 : 0;
        image.data[pp + 1] = 0;
        image.data[pp + 2] = si ? 0 : 255;
        image.data[pp + 3] = 255;
        pp += 4;
    }
}

ctx.putImageData(image, 0, 0);
