import {init2DimArray} from "./utils.js";

export function createSubsets25() {
    // possible positions of the piece
    const subsets = [];

    // possible orientations of the piece
    const orientations = init2DimArray(24);

    // notation for voxel coordinate
    // int c = 100*z + 10*y + x
    const sample = [0, 1, 2, 12, 13];
    for (let i = 0; i < 5; i++) {
        const x = sample[i] % 10;
        const y = (sample[i] - x) / 10;
        orientations[0][i] = sample[i];              // copy
        orientations[1][i] = 10 * (1 - y) + (3 - x); // inversion
        orientations[2][i] = 10 * y + (3 - x);       // x-flipped
        orientations[3][i] = 10 * (1 - y) + x;       // y-fliped
    }

    // possible rotations around (0,0,0)
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 5; i++) {
            const x = orientations[j][i] % 10;
            const y = (orientations[j][i] - x) / 10;
            const z = 0;
            orientations[4 + j][i] = 100 * z + 10 * x + y;
            orientations[2 * 4 + j][i] = 100 * y + 10 * x + z;
            orientations[3 * 4 + j][i] = 100 * y + 10 * z + x;
            orientations[4 * 4 + j][i] = 100 * x + 10 * z + y;
            orientations[5 * 4 + j][i] = 100 * x + 10 * y + z;
        }
    }

    // possible translations in the cube
    for (let j = 0; j < 24; j++) {
        const r = Math.floor(j / 4);
        const cond = (r > 0) && (j % 4 < 2);
        orientations[j].sort((a, b) => a - b);
        for (let x = 0; x < 6 - (1 << (2 - (r % 3))); x++) {
            for (let y = 0; y < (r % 5 === 0 ? 4 : ((r < 3) ? 2 : 5)); y++) {
                for (let z = 0; z < 6 - (1 << Math.floor(r / 2)); z++) {
                    const point = 100 * z + 10 * y + x;
                    // Since solution can be rotated and flipped
                    // we use only 2 orientations at 0,0,0 point
                    // This reduces number of non-unique solutions
                    // and speeds up the calculation
                    if (!(point === 0 && cond)) {
                        const subset = [];
                        for (let i = 0; i < 5; i++) {
                            subset.push(dec2pent(point + orientations[j][i]));
                        }
                        subsets.push(subset);
                    }
                }
            }
        }
    }

    return subsets;
}

// voxel number zyx to array index i
// i.e. 321 -> 3*25 + 2*5 + 1 = 86
function dec2pent(dec) {
    const x = dec % 10;
    dec = (dec - x) / 10;
    const y = dec % 10;
    dec = (dec - y) / 10;
    const z = dec;

    return 25 * z + 5 * y + x;
}
