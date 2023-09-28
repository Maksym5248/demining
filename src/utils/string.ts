const getFullName = ({
    lastName,
    firstName,
    surname
    } : {
    lastName: string,
    firstName: string,
    surname: string
}) => {
    return `${lastName} ${firstName} ${surname}`;
}


export const str = {
    getFullName
}