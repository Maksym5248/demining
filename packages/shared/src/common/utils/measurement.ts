const mToMm = (meters: number) => meters * 1000;
const mmToM = (milimeters: number) => milimeters / 1000;
const cm3ToM3 = (cm: number) => cm / 1000000;
const m3ToCm3 = (m: number) => m * 1000000;

export const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const measurement = {
    mToMm,
    mmToM,
    cm3ToM3,
    m3ToCm3,
    formatBytes,
};
