function mulVector(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y + p1.z * p2.z;
}

function subVector(p1, p2) {
    return {x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z};
}

function addVector(p1, p2) {
    return {x: p1.x + p2.x, y: p1.y + p2.y, z: p1.z + p2.z};
}

function mulScalarVector(scalar, p) {
    return {x: scalar * p.x, y: scalar * p.y, z: scalar * p.z};
}

function distance(v) {
    return Math.sqrt((v.x * v.x) + (v.y * v.y) + (v.z * v.z));
}

/**
 * <a href="https://en.wikipedia.org/wiki/Cross_product">https://en.wikipedia.org/wiki/Cross_product</a>
 * <a href="https://www.mathsisfun.com/algebra/vectors-cross-product.html">https://www.mathsisfun.com/algebra/vectors-cross-product.html</a>
 * @param v1 {{x: number, y: number, z: number}}
 * @param v2 {{x: number, y: number, z: number}}
 * @returns {{x: number, y: number, z: number}}
 */
function crossProductVector(v1, v2) {
    return {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x
    }
}

/**
 * <a href="https://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection">https://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection</a>
 * @param plane {[{x: number, y: number, z: number},{x: number, y: number, z: number},{x: number, y: number, z: number}]}
 * @param point {{x: number, y: number, z: number}}
 * @param direction {{x: number, y: number, z: number}}
 * @returns {{collidePoint: {x: number, y: number, z: number} | null, collide: boolean, distance: number|null}}
 */
function projectionInPlane(plane, point, direction) {
    const p01 = subVector(plane[1], plane[0]);
    const p02 = subVector(plane[2], plane[0]);
    const kab = mulScalarVector(5000, direction);

    const crossProd = crossProductVector(p01, p02);
    const n = mulVector(crossProd, subVector(point, plane[0]));
    const d = mulVector(crossProd, mulScalarVector(-1, kab));

    let collidePoint = null;
    let collide = false;
    let dist = null;
    if (d !== 0) {
        const t = n / d;
        const distanceVector = mulScalarVector(t, kab);
        collidePoint = addVector(point, distanceVector);
        const u = mulVector(crossProductVector(p02, mulScalarVector(-1, kab)), subVector(point, plane[0])) / d;
        const v = mulVector(crossProductVector(mulScalarVector(-1, kab), p01), subVector(point, plane[0])) / d;

        collide = t >= 0 && t <= 1 && u + v <= 1 && u >= 0 && v <= 1 && u >= 0 && u <= 1;
        dist = distance(distanceVector);
    }

    return {collidePoint, collide, distance: dist};
}

module.exports = {
    projectionInPlane,
    mulVector,
    addVector,
    subVector,
    mulScalarVector,
    crossProductVector,
    distance
};
