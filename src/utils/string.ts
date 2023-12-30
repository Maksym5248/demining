import _ from "lodash"

const getFullName = ({
	lastName,
	firstName,
	surname
} : {
    lastName: string,
    firstName: string,
    surname: string
}) => `${lastName} ${firstName} ${surname}`

const upperFirst = (str:string) => _.upperFirst(str);


export const str = {
	getFullName,
	upperFirst
}