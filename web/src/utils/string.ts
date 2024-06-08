import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';

import { DOCUMENT_TYPE } from '~/constants';

export const toUpper = (text: string) => (typeof text === 'string' ? text.toUpperCase() : text);
export const toLower = (text: string) => (typeof text === 'string' ? text.toLowerCase() : text);
export const toCamelCase = (str: string) => camelCase(str);
export const isString = (text: string) => typeof text === 'string';
const toUpperFirst = (str: string) => upperFirst(str);

const getFullName = ({
    lastName,
    firstName,
    surname,
}: {
    lastName: string;
    firstName: string;
    surname: string;
}) => `${lastName} ${firstName} ${surname}`;

const getValue = (value: DOCUMENT_TYPE) =>
    ({
        [DOCUMENT_TYPE.MISSION_REPORT]: 'Виїзд',
        [DOCUMENT_TYPE.ORDER]: 'Наказ',
    })[value];

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
    const arr = [
        address.state,
        address.municipality,
        address.city,
        address.street,
        address.housenumber,
    ].filter((el) => !!el);

    return arr.join(', ');
};

export const str = {
    getFullName,
    toUpper,
    toLower,
    toCamelCase,
    toUpperFirst,
    getValue,
    toAddressString,
};
