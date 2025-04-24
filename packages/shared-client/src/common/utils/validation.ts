import * as Yup from 'yup';

const { string, object } = Yup;

const p = (v: string) => `errors.${v}`;

const password = string().required(p('required')).min(8, p('min'));
const name = string().required(p('required')).min(2, p('min'));
const email = string().email(p('incorrect')).required(p('required')).trim(p('required'));

export const shape = <U extends Yup.ObjectShape>(fields: U) => object().shape(fields);

export const validation = {
    Yup,
    shape,
    password,
    email,
    name,
};
