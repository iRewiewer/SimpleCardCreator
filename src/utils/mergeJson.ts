// src/utils/mergeJson.ts

import { Card } from '../types';

// the five “prefixes” you support
const IMAGE_FIELDS = ['faction', 'type', 'attribute', 'card', 'overlay'] as const;
type ImageField = typeof IMAGE_FIELDS[number];

// JSON coming in may have e.g. { factionImage: 'foo.png', factionImageUrl: 'data:...' }
type JsonCard = Partial<Card> & Record<`${ImageField}Image`, string>;

export function mergeCardJson(existing: Card, parsed: JsonCard): Card {
    // use `any` here so we can assign dynamic keys without TS errors
    const out = { ...existing } as any;

    // 1) copy over scalar props
    ([
        'id', 'name', 'description', 'artworkName', 'overlay',
        'faction', 'attribute', 'type', 'ATK', 'HP', 'series',
    ] as (keyof Card)[]).forEach(k => {
        if (parsed[k] !== undefined) {
            out[k] = parsed[k];
        }
    });

    // 2) for each image field, only overwrite the blob if JSON gave us a data‑URL,
    //    but always pull in the filename
    IMAGE_FIELDS.forEach(f => {
        const urlKey = (f + 'ImageUrl') as keyof Card;
        const nameKey = (f + 'Image') as keyof JsonCard;

        const maybeUrl = parsed[urlKey] as unknown;
        const maybeName = parsed[nameKey];

        if (typeof maybeUrl === 'string' && maybeUrl.startsWith('data:')) {
            out[urlKey] = maybeUrl;
        }
        if (maybeName) {
            out[`${f}Name`] = maybeName;
        }
    });

    return out as Card;
}
