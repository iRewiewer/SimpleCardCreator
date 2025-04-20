// src/components/CardPreview.tsx

import React, { useEffect } from 'react';
import { Card } from '../types';
import '../styles/cardpreview.css';
import { TextRegion } from '../types';
import { cardTemplates } from '../types/cardTemplates';
import type { FileFieldKey } from './CardForm';

export interface CardPreviewProps {
    card: Card;
    /** Text‐region overrides from TextRegionEditor */
    templateOverrides?: Partial<Record<keyof typeof cardTemplates.default, TextRegion>>;
    /** Image‐region overrides from FileRegionEditor */
    imageOverrides?: Partial<Record<FileFieldKey, TextRegion>>;
}

const applyRegion = (region: TextRegion): React.CSSProperties => {
    const style: React.CSSProperties = {
        position: 'absolute',
        left: region.x,
        top: region.y,
        width: region.maxWidth,
        maxHeight: region.maxHeight,
        color: region.color,
        fontSize: region.fontSize,
        textAlign: region.textAlign,
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
    };
    (region.textDecoration ?? []).forEach(dec => {
        if (dec === 'Bold') style.fontWeight = 'bold';
        if (dec === 'Italic') style.fontStyle = 'italic';
        if (dec === 'Underlined') style.textDecorationLine = 'underline';
    });
    if (region.fontUrl && region.fontName) {
        const family = region.fontName.replace(/\.[^/.]+$/, '');
        style.fontFamily = `"${family}", sans-serif`;
    }
    return style;
};

const CardPreview: React.FC<CardPreviewProps> = ({
    card,
    templateOverrides = {},
    imageOverrides = {},
}) => {
    const base = cardTemplates.default;

    // convenience: get the text region
    const textRegion = (key: keyof typeof base) =>
        templateOverrides[key] ?? base[key]!;

    // imageOverrides and fallback to CSS classes
    const imgStyle = (key: FileFieldKey, cssClass: string) => {
        const region = imageOverrides[key];
        return region ? applyRegion(region) : undefined;
    };

    // preload fonts from any text override
    useEffect(() => {
        Object.values(templateOverrides).forEach(r => {
            if (r.fontUrl && r.fontName) {
                const family = r.fontName.replace(/\.[^/.]+$/, '');
                if (!(document.fonts as any).check(`1em "${family}"`)) {
                    const f = new FontFace(family, `url(${r.fontUrl})`);
                    f.load().then(loaded => document.fonts.add(loaded));
                }
            }
        });
    }, [templateOverrides]);

    return (
        <div className="card-preview" style={{ position: 'relative' }}>
            {card.cardImageUrl && (
                <img
                    className="card-preview__background"
                    src={card.cardImageUrl}
                    alt="Background"
                    style={imgStyle('card', 'card-preview__background')}
                />
            )}
            {card.overlayImageUrl && (
                <img
                    className="card-preview__overlay"
                    src={card.overlayImageUrl}
                    alt="Overlay"
                    style={imgStyle('overlay', 'card-preview__overlay')}
                />
            )}

            {card.factionImageUrl && (
                <img
                    className="card-preview__faction"
                    src={card.factionImageUrl}
                    alt="Faction"
                    style={imgStyle('faction', 'card-preview__faction')}
                />
            )}
            {card.typeImageUrl && (
                <img
                    className="card-preview__type"
                    src={card.typeImageUrl}
                    alt="Type"
                    style={imgStyle('type', 'card-preview__type')}
                />
            )}
            {card.attributeImageUrl && (
                <img
                    className="card-preview__attribute"
                    src={card.attributeImageUrl}
                    alt="Attribute"
                    style={imgStyle('attribute', 'card-preview__attribute')}
                />
            )}

            {/* now render the TEXT versions as well */}
            <div style={applyRegion(textRegion('faction'))}>
                {card.faction}
            </div>
            <div style={applyRegion(textRegion('type'))}>
                {card.type}
            </div>
            <div style={applyRegion(textRegion('attribute'))}>
                {card.attribute}
            </div>

            <div style={applyRegion(textRegion('name'))}>
                {card.name}
            </div>
            <div style={applyRegion(textRegion('atk'))}>
                {card.ATK}
            </div>
            <div style={applyRegion(textRegion('hp'))}>
                {card.HP}
            </div>
            <div style={applyRegion(textRegion('description'))}>
                {card.description}
            </div>
            <div style={applyRegion(textRegion('series'))}>
                {card.series}
            </div>
        </div>
    );
};

export default CardPreview;
