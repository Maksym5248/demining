import { makeAutoObservable } from 'mobx';
import FormMRF from 'mobx-react-form';
import { type SubmitHooks } from 'mobx-react-form/lib/models/SharedActionsInterface';
import yup from 'mobx-react-form/lib/validators/YUP';
import { type Path, validation } from 'shared-my-client';

import { createField, type IField } from './field';

export interface IForm<T> {
    field: (name: Path<T>) => IField;
    submit: () => void;
    isValid: boolean;
}

export class Form<T> implements IForm<T> {
    form: FormMRF;

    constructor(private params: { schema: any; fields: any; submit: SubmitHooks }) {
        const plugins = {
            yup: yup({
                schema: () => this.params.schema,
                package: validation.Yup,
                // extend: ({ validator, form }) => {},
            }),
        };

        const fields = this.params?.fields ?? [];

        const options = {
            validateOnInit: false,
            validateOnChange: true,
        };

        this.form = new FormMRF({ fields }, { plugins, options });

        makeAutoObservable(this);
    }

    field = (name: Path<T>) => {
        return createField(this.form.$(name));
    };

    submit = () => {
        this.form.submit(this.params.submit);
    };

    get isValid() {
        return this.form.isValid;
    }
}
