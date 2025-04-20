// src/components/CardPreview.tsx

import React from 'react';
import { Card } from '../types';
import '../styles/cardpreview.css';
import type { TextRegion } from '../config/cardTemplates';

export interface CardPreviewProps {
    card: Card;
    /** Optional per‐field layout overrides */
    templateOverrides?: Partial<Record<keyof Card, TextRegion>>;
}

const CardPreview: React.FC<CardPreviewProps> = ({
    card,
    templateOverrides = {},
}) => {
    // you can now read templateOverrides.name/description/etc.
    // and apply them in your canvas/drawing logic if you want.
    return (
        <div className="card-preview">
            {card.cardImageUrl && (
                <img
                    className="card-preview__background"
                    src={card.cardImageUrl}
                    alt="Card Background"
                />
            )}
            {card.overlayImageUrl && (
                <img
                    className="card-preview__overlay"
                    src={card.overlayImageUrl}
                    alt="Card Overlay"
                />
            )}
            {card.factionImageUrl && (
                <img
                    className="card-preview__faction"
                    src={card.factionImageUrl}
                    alt="Faction"
                />
            )}
            {card.typeImageUrl && (
                <img
                    className="card-preview__type"
                    src={card.typeImageUrl}
                    alt="Type"
                />
            )}
            {card.attributeImageUrl && (
                <img
                    className="card-preview__attribute"
                    src={card.attributeImageUrl}
                    alt="Attribute"
                />
            )}
            <div className="card-preview__name">{card.name}</div>
            <div className="card-preview__atk">{card.ATK}</div>
            <div className="card-preview__hp">{card.HP}</div>
            <div className="card-preview__description">{card.description}</div>
        </div>
    );
};

export default CardPreview;
