import _ from 'lodash';

export const toUpper = (text: string) => (typeof text === 'string' ? text.toUpperCase() : text);
export const toLower = (text: string) => (typeof text === 'string' ? text.toLowerCase() : text);

export const toCamelCase = (str: string) => _.camelCase(str);

export const toUpperFirst = (text: string) => {
    if (typeof text !== 'string') {
        return text;
    }

    const str1 = text[0].toUpperCase();
    const str2 = text.slice(1);

    return str1 + str2;
};

export const isString = (text: any) => typeof text === 'string';

export const getFullName = (user: { firstName?: string; lastName?: string }) => (user ? `${user?.firstName} ${user?.lastName}` : '');

export const getFirstLastNames = (fullName: string) => {
    if (typeof fullName !== 'string') {
        return fullName;
    }

    const name = _.trim(fullName).split(' ');
    return [name[0], name.length > 1 ? name[name.length - 1] : ''];
};
