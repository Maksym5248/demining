import * as Yup from 'yup';

const { string, object, mixed } = Yup;

const p = (message: string, value?: string) => ({
    message,
    value,
});

const password = () => string().required(p('required')).min(8, p('min-password-length', '8')).max(20, p('max-password-length', '20'));
const confirmPassword = (getPass: () => string) =>
    mixed()
        .required(p('required'))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .when('password', ([pass], schema) => schema.test('passwords-must-match', p('passwords-must-match'), value => value === getPass()));
const name = () => string().required(p('required')).min(2, p('min-length', '2'));
const email = () => string().email(p('invalid-email')).required(p('required')).trim(p('required'));
const uri = () => string().optional();
const required = () => string().required(p('required'));

export const shape = <U extends Yup.ObjectShape>(fields: U) => object().shape(fields);

export const validation = {
    Yup,
    shape,
    password,
    confirmPassword,
    email,
    name,
    uri,
    required,
};
