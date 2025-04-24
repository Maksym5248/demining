import { makeAutoObservable } from 'mobx';
import { Form as FormMRF } from 'mobx-react-form';
import { type FieldConstructor } from 'mobx-react-form/lib/models/FieldInterface';
import yup from 'mobx-react-form/lib/validators/YUP';
import { validation } from 'shared-my-client';

import { Field } from './field';

export interface IForm extends FormMRF {}

export class Form extends FormMRF implements IForm {
    constructor(private params: { schema: any; fields: any }) {
        super();
        makeAutoObservable(this);
    }

    plugins() {
        return {
            yup: yup({ schema: this.params.schema, package: validation.Yup }),
        };
    }
    setup() {
        return {
            fields: this.params.fields,
        };
    }

    makeField(props: FieldConstructor) {
        return new Field(props);
    }
}
