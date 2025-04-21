// src/types/index.ts

// === Card data model ===

export interface Card {
    id: number;
    name: string;
    description: string;
    artworkName: string;
    overlay: string;
    faction: string;
    attribute: string;
    type: string;    // e.g. 'Unit', 'Spell', etc.
    ATK: number;
    HP: number;
    series: string;

    // Font URLs for each text field
    nameFontUrl: string;
    descriptionFontUrl: string;
    atkFontUrl: string;
    hpFontUrl: string;

    // Uploaded images as data‑URLs
    factionImageUrl: string;
    typeImageUrl: string;
    attributeImageUrl: string;
    cardImageUrl: string;
    overlayImageUrl: string;

    // Uploaded image filenames
    factionName?: string;
    typeName?: string;
    attributeName?: string;
    cardName?: string;
    overlayName?: string;
}

// === Layout configuration types ===

/** Which text decorations are available. */
export enum TextDecoration {
    Bold = 'Bold',
    Italic = 'Italic',
    Underlined = 'Underlined',
}

/** Horizontal alignment options for text. */
export enum TextAlign {
    Left = 'left',
    Center = 'center',
    Right = 'right',
    Justify = 'justify',
}

/**
 * Defines a rectangular region plus optional styling
 * for rendering text or images on the card.
 */
export interface TextRegion {
    x: number;
    y: number;
    maxWidth: number;
    maxHeight: number;
    color?: string;                    // CSS color string
    fontSize?: number;                 // in px
    fontUrl?: string;                  // data‑URL of uploaded font
    fontName?: string;                 // friendly name to display
    textDecoration?: TextDecoration[]; // bold/italic/underlined
    textAlign?: TextAlign;             // left/center/right/justify
}

/**
 * A full set of named regions for every card property.
 * (All keys required so your defaults can type‑check.)
 */
export interface CardTemplate {
    name: TextRegion;
    description: TextRegion;
    atk: TextRegion;
    hp: TextRegion;
    faction: TextRegion;
    attribute: TextRegion;
    type: TextRegion;
    series: TextRegion;
}
