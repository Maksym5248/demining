import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';

export const toUpper = (text: string) => (typeof text === 'string' ? text.toUpperCase() : text);
export const toLower = (text: string) => (typeof text === 'string' ? text.toLowerCase() : text);
export const toCamelCase = (str: string) => camelCase(str);

const toUpperFirst = (str: string) => upperFirst(str);

const getFullName = ({ lastName, firstName, surname }: { lastName: string; firstName: string; surname: string }) =>
    `${lastName} ${firstName} ${surname}`;

const toAddressString = (address: {
    city: string;
    country: string;
    district: string;
    housenumber: string;
    postcode: string;
    state: string;
    street: string;
    municipality: string;
}) => {
    const arr = [address.state, address.municipality, address.city, address.street, address.housenumber].filter((el) => !!el);

    return arr.join(', ');
};

export const str = {
    getFullName,
    toUpper,
    toLower,
    toCamelCase,
    toUpperFirst,
    toAddressString,
};
