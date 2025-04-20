import React, { useState } from 'react';
import CardForm from '../components/CardForm';
import CardPreview from '../components/CardPreview';
import Modal from '../components/Modal';
import TextRegionEditor from '../components/TextRegionEditor';
import { Card } from '../types';
import { TextRegion, cardTemplates, CardTemplate } from '../config/cardTemplates';
import '../styles/single-card-creator.css';

// The form uses these exact Card keys:
type FieldKey = 'name' | 'description' | 'ATK' | 'HP' | 'faction' | 'attribute' | 'type' | 'series';
// Template keys are lowercase:
type TemplateKey = keyof CardTemplate;

const SingleCardCreator: React.FC = () => {
    const [card, setCard] = useState<Card>({
        id: 0,
        name: '',
        description: '',
        artworkName: '',
        overlay: '',
        faction: '',
        attribute: '',
        type: 'Unit',
        ATK: 0,
        HP: 0,
        series: '',
        nameFontUrl: '',
        descriptionFontUrl: '',
        atkFontUrl: '',
        hpFontUrl: '',
        factionImageUrl: '',
        typeImageUrl: '',
        attributeImageUrl: '',
        cardImageUrl: '',
        overlayImageUrl: '',
    });

    // overrides stored by the lowercase TemplateKey
    const [overrides, setOverrides] = useState<Partial<Record<TemplateKey, TextRegion>>>({});
    // which Card-field is being edited
    const [editingField, setEditingField] = useState<FieldKey | null>(null);

    const openEditor = (field: FieldKey) => setEditingField(field);
    const closeEditor = () => setEditingField(null);

    const saveTemplate = (region: TextRegion) => {
        if (!editingField) return;
        const key = editingField.toLowerCase() as TemplateKey;
        setOverrides(o => ({ ...o, [key]: region }));
        closeEditor();
    };

    const initialRegion = (field: FieldKey): TextRegion => {
        const key = field.toLowerCase() as TemplateKey;
        return (
            overrides[key] ??
            cardTemplates[card.type]?.[key] ??
            cardTemplates.default[key]!
        );
    };

    return (
        <div className="single-container">
            <div className="creator-layout">
                <div className="preview-container">
                    <h3>Card Preview</h3>
                    <CardPreview
                        card={card}
                        templateOverrides={overrides}
                    />
                </div>
                <div className="properties-container">
                    <h3>Properties</h3>
                    <CardForm
                        card={card}
                        onChange={setCard}
                        onConfigureTemplate={openEditor}
                    />
                </div>
            </div>

            {editingField && (
                <Modal onClose={closeEditor}>
                    <TextRegionEditor
                        field={editingField}
                        initial={initialRegion(editingField)}
                        onSave={saveTemplate}
                        onCancel={closeEditor}
                    />
                </Modal>
            )}
        </div>
    );
};

export default SingleCardCreator;
