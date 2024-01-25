import _ from "lodash"

export const toUpper = (text: string) => (typeof text === 'string' ? text.toUpperCase() : text);
export const toLower = (text: string) => (typeof text === 'string' ? text.toLowerCase() : text);

export const toCamelCase = (str:string) => _.camelCase(str);


export const isString = (text: string) => typeof text === 'string';

const getFullName = ({
	lastName,
	firstName,
	surname
} : {
    lastName: string,
    firstName: string,
    surname: string
}) => `${lastName} ${firstName} ${surname}`

const toUpperFirst = (str:string) => _.upperFirst(str);


export const str = {
	getFullName,
	toUpper,
	toLower,
	toCamelCase,
	toUpperFirst
}