// src/components/CardPropertiesPanel.tsx

import React from 'react';
import CardForm, { FieldKey, FileFieldKey } from './CardForm';
import { Card } from '../types';

export type { FieldKey, FileFieldKey };

export interface CardPropertiesPanelProps {
    card: Card;
    onChange: (updated: Card) => void;
    onConfigureTemplate: (field: FieldKey) => void;
    onConfigureFileLayout: (field: FileFieldKey) => void;
}

const CardPropertiesPanel: React.FC<CardPropertiesPanelProps> = ({
    card,
    onChange,
    onConfigureTemplate,
    onConfigureFileLayout,
}) => (
    <div className="properties-panel">
        <h3>Properties</h3>
        <CardForm
            card={card}
            onChange={onChange}
            onConfigureTemplate={onConfigureTemplate}
            onConfigureFileLayout={onConfigureFileLayout}
        />
    </div>
);

export default CardPropertiesPanel;
