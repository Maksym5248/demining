import { makeAutoObservable } from 'mobx';
import FormMRF from 'mobx-react-form';
import { type SubmitHooks } from 'mobx-react-form/lib/models/SharedActionsInterface';
import yup from 'mobx-react-form/lib/validators/YUP';

import { validation, type Path } from '~/common';

import { ErrorModel } from './ErrorModel';
import { createField, type IField } from './FieldModel';

export interface IForm<T> {
    field: (name: Path<T>) => IField;
    submit: () => void;
    reset: () => void;
    values: () => T;
    setErrors: (error?: any) => void;
    setValues: (values: Partial<T>) => void;
    isValid: boolean;
    isDisabled: boolean;
}

export class Form<T> implements IForm<T> {
    form: FormMRF;
    isRunned = false;

    constructor(private params: { schema: any; fields: any; submit: SubmitHooks }) {
        const plugins = {
            yup: yup({
                schema: () => this.params.schema,
                package: validation.Yup,
            }),
        };

        const fields = this.params?.fields ?? [];

        const options = {
            validateOnInit: true,
            validateOnChange: true,
        };

        this.form = new FormMRF({ fields }, { plugins, options });

        makeAutoObservable(this);
    }

    private setRunned() {
        this.isRunned = true;
    }

    field = (name: Path<T>) => {
        return createField(this.form.$(name), this);
    };

    submit = () => {
        this.setRunned();

        if (!this.form.isValid) {
            return;
        }

        this.form.submit(this.params.submit);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setValues = (values: Partial<T>) => {
        Object.keys(values).forEach(key => {
            // @ts-ignore
            this.field(key)?.setValue(values[key]);
        });
    };

    setErrors(error?: any) {
        const e = new ErrorModel(error);

        e?.fields?.forEach(el => {
            if (!!el?.field && !!el?.message) {
                // @ts-ignore
                this.field(el.field).setError(el?.message);
            }
        });
    }

    reset = () => {
        this.form.reset();
    };

    values = () => {
        return this.form.values();
    };

    get isValid() {
        return this.form.isValid;
    }

    get isDisabled() {
        return this.isRunned ? !this.form.isValid : false;
    }
}
