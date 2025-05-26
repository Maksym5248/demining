import { DOCUMENT_TYPE } from 'shared-my';

const getValue = (value: DOCUMENT_TYPE) =>
    ({
        [DOCUMENT_TYPE.MISSION_REPORT]: 'Виїзд',
        [DOCUMENT_TYPE.ORDER]: 'Наказ',
    })[value];

const getTitle = (wizard: { isView: boolean; isCreate: boolean; isEdit: boolean }, name?: string) => {
    if (wizard.isEdit) {
        return `Редагувати: ${name}`;
    }
    if (wizard.isCreate) {
        return `Створити`;
    }

    return name;
};

export const str = {
    getTitle,
    getValue,
};
