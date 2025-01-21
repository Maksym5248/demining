const mToMm = (meters: number) => meters * 1000;
const mmToM = (milimeters: number) => milimeters / 1000;
const cm3ToM3 = (cm: number) => cm / 1000000;
const m3ToCm3 = (m: number) => m * 1000000;

export const measurement = {
    mToMm,
    mmToM,
    cm3ToM3,
    m3ToCm3,
};
