function squareCircle(r: number){
	return  Math.round(Math.PI * r * r);
}

function toFixed(value:number | any, signs:number = 2){
	if(Number.isNaN(value)){
		return value
	}
    
	return Number(value.toFixed(signs))
}

export const mathUtils = {
	squareCircle,
	toFixed
}