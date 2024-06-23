import { DATA_TYPE } from 'jsstore';
import { TABLES } from 'shared-my/db';

export const schemaMapViewAction = {
    name: TABLES.MAP_VIEW_ACTION,
    columns: {
        id: {
            unique: true,
            primaryKey: true,
        },
        documentId: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
        documentType: {
            notNull: true,
            dataType: DATA_TYPE.String,
        },
        markerLat: {
            notNull: true,
            dataType: DATA_TYPE.Number,
        },
        markerLng: {
            notNull: true,
            dataType: DATA_TYPE.Number,
        },
        circleCenterLat: {
            default: 0,
            dataType: DATA_TYPE.Number,
        },
        circleCenterLng: {
            default: 0,
            dataType: DATA_TYPE.Number,
        },
        circleRadius: {
            default: 0,
            dataType: DATA_TYPE.Number,
        },
        zoom: {
            notNull: true,
            dataType: DATA_TYPE.Number,
        },
        createdAt: {
            notNull: true,
            dataType: DATA_TYPE.DateTime,
        },
        updatedAt: {
            notNull: true,
            dataType: DATA_TYPE.DateTime,
        },
    },
};
