import {
    CardTemplate,
} from '../types';

// Your one and only default template set (under the `default` key)
export const cardTemplates: { default: CardTemplate } = {
    default: {
        name: {
            x: 0, y: 0,
            maxWidth: 250, maxHeight: 250,
        },
        description: {
            x: 0, y: 0,
            maxWidth: 250, maxHeight: 250,
        },
        atk: {
            x: 0, y: -50,
            maxWidth: 250, maxHeight: 250,
        },
        hp: {
            x: 0, y: -50,
            maxWidth: 250, maxHeight: 250,
        },
        faction: {
            x: 0, y: 0,
            maxWidth: 250, maxHeight: 250,
        },
        attribute: {
            x: 0, y: 0,
            maxWidth: 250, maxHeight: 250,
        },
        type: {
            x: 0, y: 0,
            maxWidth: 250, maxHeight: 250,
        },
        series: {
            x: 0, y: 0,
            maxWidth: 250, maxHeight: 250,
        },
    },
};
