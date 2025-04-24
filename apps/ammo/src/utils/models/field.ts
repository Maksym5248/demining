import { Field as FieldMRF } from 'mobx-react-form';
import { type FieldConstructor } from 'mobx-react-form/lib/models/FieldInterface';

export interface IField extends FieldMRF {}

export class Field extends FieldMRF implements IField {
    constructor(props: FieldConstructor) {
        super(props);
    }
}
