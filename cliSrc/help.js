export function printHelp() {
    const s = `
Pentamino solver. Usage:
node cli fileName.json
  fileName.json values
    items: number | {I: 1, Y: 2, ...} for any of INLUXWPFZTVY
    space: [height, width] | [[0, 1,...]...]

Examples:

Cover 2x5 square with the specified figures
{
  "items": {"I": 2, "N": 1, "L": 1, "P": 2},
  "space": [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1]
  ]
}
Cover 12x10 square with two full pentamino sets
{
  "items": 2,
  "space": [12, 10]
}
Cover chess board with full pentamino sets
{
  "items": {"I": 1, "N": 1, "L": 1, "U": 1, "X": 1, "W": 1, "P": 1, "F": 1, "Z": 1, "T": 1, "V": 1, "Y": 1},
  "space": [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
  ]
}
`;
    console.log(s);
}
