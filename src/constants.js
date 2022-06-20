export const planetColors = [
  "#2365c1",
  "#23b6c1",
  "#23c166",
  "#9dc123",
  "#d9a323",
  "#b44944",
  "#c12359",
  "#c123b1",
  "#c123ff",
];

var d = 24,
  h = 1;
export const planetRotationTime = {
  199: 58 * d + 16 * h,
  299: 243 * d,
  399: 24 * h,
  499: 24 * h,
  599: 10 * h,
  699: 10 * h,
  799: 17 * h,
  899: 16 * h,
};

export const stepInHours = {
  "1 DAY": 24 * h,
  "1 HOUR": h,
  "7 DAYS": 7 * 24 * h,
};

const distanceMod = 3.5e8;
export const constants = {
  radiusModifier: 50000,
  distanceModifier: {
    x: distanceMod,
    y: distanceMod,
    z: distanceMod,
  },
};
