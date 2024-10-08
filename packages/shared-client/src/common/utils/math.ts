function squareCircle(r: number) {
    return Math.round(Math.PI * r * r);
}

function toFixed(value: number | any, signs = 2) {
    if (!value) {
        return undefined;
    }

    if (Number.isNaN(value)) {
        return value;
    }

    return Number(value.toFixed(signs));
}

export const mathUtils = {
    squareCircle,
    toFixed,
};
