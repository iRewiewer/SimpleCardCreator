// src/utils/mergeJson.ts

import { Card, TextRegion, TextDecoration, TextAlign } from '../types';
import { cardTemplates } from '../types/cardTemplates';

// Result of merging: updated card + region overrides
export interface MergeResult {
    card: Card;
    textOverrides: Partial<Record<keyof typeof cardTemplates.default, TextRegion>>;
    imageOverrides: Partial<Record<ImageField, TextRegion>>;
}

// JSON shapes for nested regions, using actual types
type JsonTextRegion = {
    text: string;
    x: number;
    y: number;
    maxWidth: number;
    maxHeight: number;
    color?: string;
    fontSize?: number;
    textDecoration?: TextDecoration[];
    textAlign?: TextAlign;
    fontFile?: string;
};

type JsonFileRegion = {
    fileData: string;
    x: number;
    y: number;
    maxWidth: number;
    maxHeight: number;
};

// Supported image field prefixes
const IMAGE_FIELDS = ['faction', 'type', 'attribute', 'card', 'overlay'] as const;
export type ImageField = typeof IMAGE_FIELDS[number];

// Type guards
function isJsonTextRegion(val: any): val is JsonTextRegion {
    return val != null && typeof val === 'object' && typeof val.text === 'string';
}

function isJsonFileRegion(val: any): val is JsonFileRegion {
    return val != null && typeof val === 'object' && typeof val.fileData === 'string';
}

/**
 * Merge incoming JSON (flat or nested export) into existing Card,
 * extracting updated card plus region overrides.
 */
export function mergeCardJson(existing: Card, parsed: any): MergeResult {
    const out: any = { ...existing };
    const textOverrides: MergeResult['textOverrides'] = {};
    const imageOverrides: MergeResult['imageOverrides'] = {};

    // Text fields with potential nested regions
    const TEXT_FIELDS = ['name', 'description', 'ATK', 'HP', 'faction', 'attribute', 'type', 'series'] as const;

    TEXT_FIELDS.forEach(f => {
        const val = parsed[f];
        const key = (f === 'ATK' ? 'ATK' : f === 'HP' ? 'HP' : f) as keyof typeof cardTemplates.default;

        if (isJsonTextRegion(val)) {
            // Merge text
            out[f] = (f === 'ATK' || f === 'HP') ? Number(val.text) : val.text;
            // Merge font URL
            if (val.fontFile) {
                const fontKey = f === 'ATK' ? 'ATKFontUrl' : f === 'HP' ? 'HPFontUrl' : (`${f}FontUrl` as keyof Card);
                out[fontKey] = val.fontFile;
            }
            // Extract region override
            textOverrides[key] = {
                x: val.x,
                y: val.y,
                maxWidth: val.maxWidth,
                maxHeight: val.maxHeight,
                color: val.color,
                fontSize: val.fontSize,
                textDecoration: val.textDecoration,
                textAlign: val.textAlign,
                fontUrl: val.fontFile,
            };
        } else if (val !== undefined && typeof val !== 'object') {
            out[f] = val;
        }
    });

    // File/image fields
    IMAGE_FIELDS.forEach(f => {
        const nested = parsed[f];
        if (isJsonFileRegion(nested)) {
            if (nested.fileData.startsWith('data:')) {
                out[`${f}ImageUrl` as keyof Card] = nested.fileData;
            } else {
                out[`${f}Name` as keyof Card] = nested.fileData;
            }
            imageOverrides[f] = {
                x: nested.x,
                y: nested.y,
                maxWidth: nested.maxWidth,
                maxHeight: nested.maxHeight,
            };
        } else {
            const urlKey = `${f}ImageUrl`;
            const nameKey = `${f}Image`;
            const maybeUrl = parsed[urlKey];
            const maybeName = parsed[nameKey];
            if (typeof maybeUrl === 'string') out[urlKey as keyof Card] = maybeUrl;
            if (maybeName) out[`${f}Name` as keyof Card] = maybeName;
        }
    });

    return { card: out as Card, textOverrides, imageOverrides };
}
