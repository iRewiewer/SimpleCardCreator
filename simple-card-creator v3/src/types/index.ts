export interface Card {
    id: number;
    name: string;
    description: string;
    artworkName: string;
    overlay: string; // JSON-provided overlay filename
    faction: string;
    attribute: string;
    type: 'Unit' | 'Spell' | 'Sabotage' | 'Raid Boss';
    ATK?: number;
    HP?: number;
    series: string;

    // Optional font URLs
    nameFontUrl?: string;
    descriptionFontUrl?: string;
    atkFontUrl?: string;
    hpFontUrl?: string;

    // Optional image URLs (data URLs after upload)
    factionImageUrl?: string;
    typeImageUrl?: string;
    attributeImageUrl?: string;
    cardImageUrl?: string;
    overlayImageUrl?: string;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    card: Card;
}