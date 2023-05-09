const {crossProductVector, mulScalarVector, subVector, addVector, mulVector, projectionInPlane} = require('./src/lib');

describe('Validate projection', function () {
    test('should validate mulVector function', function () {
        expect(mulVector({x: 3, y: 2, z: 3}, {x: 0, y: 2, z: 1}))
            .toBe(7);
        expect(mulVector({x: 1, y: 1, z: -1}, {x: 1, y: -1, z: 0}))
            .toBe(0);
    });

    test('should validate addVector function', function () {
        const pos = {x: 3, y: 2, z: 3};
        const v = addVector(pos, {x: 0, y: 2, z: 1});
        expect(v).toMatchObject({x: 3, y: 4, z: 4});
    });

    test('should validate subVector function', function () {
        const pos = {x: 3, y: 2, z: 3};
        const v = subVector(pos, {x: 0, y: 2, z: 1});
        expect(v).toMatchObject({x: 3, y: 0, z: 2});
    });

    test('should validate subVector function', function () {
        const pos = {x: 3, y: 2, z: 3};
        const v = mulScalarVector(5, pos);
        expect(v).toMatchObject({x: 15, y: 10, z: 15});
    });

    test('should validate subVector function', function () {
        expect(crossProductVector({x: 2, y: 3, z: 4}, {x: 5, y: 6, z: 7}))
            .toMatchObject({x: -3, y: 6, z: -3});
    });

    test('should get line projection in plane', function () {
        const plane = [
            {x: 0, y: 1, z: 1},
            {x: 1, y: 2, z: 0},
            {x: 1, y: 0, z: 1},
        ];

        const pos = {x: 3, y: 2, z: 3};
        const direction = subVector(plane[0], pos);
        console.log(direction)

        const proj = projectionInPlane(plane, pos, direction);
        expect(proj).toMatchObject(plane[0]);
    });
});
