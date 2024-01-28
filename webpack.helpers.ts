/**
 * Are we in development mode?
 */
function inDev() {
	return process.env.NODE_ENV === 'dev';
}

export {
	inDev,
}
