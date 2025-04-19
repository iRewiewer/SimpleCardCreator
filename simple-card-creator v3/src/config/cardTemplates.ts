// src/config/cardTemplates.ts

export enum TextDecoration {
    Bold = 'bold',
    Italic = 'italic',
    Underlined = 'underlined',
}

export enum Color {
    Red = '#ff0000',
    Green = '#008000',
    Blue = '#0000ff',
    Yellow = '#ffff00',
    Purple = '#800080',
    Orange = '#ffa500',
    Black = '#000000',
    White = '#ffffff',
    Gray = '#808080',
    LightGray = '#d3d3d3',
}

// text alignment options
export enum TextAlign {
    Left = 'left',
    Center = 'center',
    Right = 'right',
    Justify = 'justify',
}

export interface TextRegion {
    x: number;
    y: number;
    maxWidth: number;
    maxHeight: number;
    color?: string;
    fontSize?: number;
    textDecoration?: TextDecoration[];
    textAlign?: TextAlign;
}

export interface CardTemplate {
    name?: TextRegion;
    description?: TextRegion;
    atk?: TextRegion;
    hp?: TextRegion;
    faction?: TextRegion;
    attribute?: TextRegion;
    type?: TextRegion;
    series?: TextRegion;
}

export const cardTemplates: Record<string, CardTemplate> = {
    Unit: {
        name: {
            x: 140, y: 530, maxWidth: 300, maxHeight: 30,
            color: Color.White, fontSize: 24,
            textDecoration: [TextDecoration.Bold],
            textAlign: TextAlign.Center
        },
        description: {
            x: 40, y: 580, maxWidth: 430, maxHeight: 90,
            color: Color.White, fontSize: 16,
            textAlign: TextAlign.Justify
        },
        atk: {
            x: 60, y: 485, maxWidth: 50, maxHeight: 50,
            color: Color.Red, fontSize: 36,
            textDecoration: [TextDecoration.Bold]
        },
        hp: {
            x: 200, y: 460, maxWidth: 50, maxHeight: 50,
            color: Color.Green, fontSize: 20,
            textDecoration: [TextDecoration.Bold]
        },
        faction: {
            x: 300, y: 40, maxWidth: 200, maxHeight: 30,
            fontSize: 14
        },
        attribute: {
            x: 300, y: 80, maxWidth: 200, maxHeight: 30,
            fontSize: 14
        },
        type: {
            x: 300, y: 120, maxWidth: 200, maxHeight: 30,
            fontSize: 14
        },
        series: {
            x: 15, y: 745, maxWidth: 400, maxHeight: 30,
            fontSize: 14, color: Color.Gray,
            textDecoration: [TextDecoration.Italic]
        },
    },
    "Raid Boss": {
    },
    Spell: {
    },
    Sabotage: {
    },
    default: {
        name: {
            x: 60, y: 40, maxWidth: 220, maxHeight: 50,
            fontSize: 24,
            textAlign: TextAlign.Left
        },
        description: {
            x: 60, y: 300, maxWidth: 220, maxHeight: 120,
            fontSize: 16,
            textAlign: TextAlign.Left
        },
    },
};
