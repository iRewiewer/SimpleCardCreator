// src/pages/SingleCardCreator.tsx

import React, { useState, useRef, useEffect } from 'react';
import CardPreview from '../components/CardPreview';
import CardPropertiesPanel, { FieldKey, FileFieldKey } from '../components/CardPropertiesPanel';
import Modal from '../components/Modal';
import TextRegionEditor from '../components/TextRegionEditor';
import FileRegionEditor from '../components/FileRegionEditor';
import { Card, TextRegion } from '../types';
import { cardTemplates } from '../types/cardTemplates';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import '../styles/single-card-creator.css';

const STORAGE_KEY = 'singleCardCreatorData';

const initialCard: Card = {
    id: 0,
    name: '',
    description: '',
    artworkName: '',
    overlay: '',
    faction: '',
    attribute: '',
    type: '',
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
};

const DEFAULT_IMAGE_REGION: TextRegion = {
    x: 0,
    y: 0,
    maxWidth: 100,
    maxHeight: 100,
};

const SingleCardCreator: React.FC = () => {
    // --- State hooks ---
    const [card, setCard] = useState<Card>(initialCard);
    const [overrides, setOverrides] = useState<Partial<Record<keyof typeof cardTemplates.default, TextRegion>>>({});
    const [imageOverrides, setImageOverrides] = useState<Partial<Record<FileFieldKey, TextRegion>>>({});
    const [didLoad, setDidLoad] = useState(false);

    // editor state
    const [editingField, setEditingField] = useState<FieldKey | null>(null);
    const [savedRegion, setSavedRegion] = useState<TextRegion | undefined>(undefined);
    const [editingImageField, setEditingImageField] = useState<FileFieldKey | null>(null);
    const [savedImageRegion, setSavedImageRegion] = useState<TextRegion | undefined>(undefined);

    // load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const { card, overrides, imageOverrides } = JSON.parse(stored);
                setCard(card);
                setOverrides(overrides);
                setImageOverrides(imageOverrides);
            } catch {
                // ignore parse errors
            }
        }
        setDidLoad(true);
    }, []);

    // save to localStorage whenever relevant state changes (after load)
    useEffect(() => {
        if (!didLoad) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ card, overrides, imageOverrides }));
    }, [didLoad, card, overrides, imageOverrides]);

    // --- Text editor handlers ---
    const openTextEditor = (field: FieldKey) => {
        setEditingField(field);
        const key = field.toLowerCase() as keyof typeof cardTemplates.default;
        setSavedRegion(overrides[key]);
    };
    const cancelTextTemplate = () => {
        if (editingField) {
            const key = editingField.toLowerCase() as keyof typeof cardTemplates.default;
            setOverrides(o => {
                const copy = { ...o };
                if (savedRegion !== undefined) copy[key] = savedRegion;
                else delete copy[key];
                return copy;
            });
        }
        setEditingField(null);
        setSavedRegion(undefined);
    };
    const saveTextTemplate = (region: TextRegion) => {
        if (editingField) {
            const key = editingField.toLowerCase() as keyof typeof cardTemplates.default;
            setOverrides(o => ({ ...o, [key]: region }));
        }
        setEditingField(null);
        setSavedRegion(undefined);
    };

    // --- File editor handlers ---
    const openFileEditor = (field: FileFieldKey) => {
        setEditingImageField(field);
        setSavedImageRegion(imageOverrides[field]);
    };
    const cancelFileTemplate = () => {
        if (editingImageField) {
            setImageOverrides(o => {
                const copy = { ...o };
                if (savedImageRegion !== undefined) copy[editingImageField] = savedImageRegion;
                else delete copy[editingImageField];
                return copy;
            });
        }
        setEditingImageField(null);
        setSavedImageRegion(undefined);
    };
    const saveFileTemplate = (region: TextRegion) => {
        if (editingImageField) {
            setImageOverrides(o => ({ ...o, [editingImageField]: region }));
        }
        setEditingImageField(null);
        setSavedImageRegion(undefined);
    };

    // --- Helpers for initial regions ---
    const initialTextRegion = (field: FieldKey): TextRegion => {
        const key = field.toLowerCase() as keyof typeof cardTemplates.default;
        return overrides[key] ?? cardTemplates.default[key];
    };
    const initialImageRegion = (field: FileFieldKey): TextRegion =>
        imageOverrides[field] ?? DEFAULT_IMAGE_REGION;

    // --- Generate PNG ---
    const previewRef = useRef<HTMLDivElement>(null);
    const generatePng = async () => {
        if (!previewRef.current) return;
        const canvas = await html2canvas(previewRef.current);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const cardname = `${card.name || 'card'}-${timestamp}.png`;
        canvas.toBlob(blob => {
            if (blob) saveAs(blob, cardname);
        });
    };

    // --- Download JSON (filenames only) ---
    const downloadJson = () => {
        const {
            factionImageUrl,
            typeImageUrl,
            attributeImageUrl,
            cardImageUrl,
            overlayImageUrl,
            ...rest
        } = card;
        const jsonObj = {
            ...rest,
            factionImage: (card as any).factionName || '',
            typeImage: (card as any).typeName || '',
            attributeImage: (card as any).attributeName || '',
            cardImage: (card as any).cardName || '',
            overlayImage: (card as any).overlayName || '',
        };
        const blob = new Blob([JSON.stringify(jsonObj, null, 2)], { type: 'application/json' });
        saveAs(blob, `${card.name || 'card'}.json`);
    };

    // --- Clear All: reset state & storage ---
    const clearAll = () => {
        setCard(initialCard);
        setOverrides({});
        setImageOverrides({});
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <div className="single-container">
            <div className="top-actions">
                <button className="btn clear-btn" onClick={clearAll}>
                    Clear All Fields
                </button>
            </div>
            <div className="creator-layout">
                <div className="preview-container">
                    <div ref={previewRef}>
                        <CardPreview
                            card={card}
                            templateOverrides={overrides}
                            imageOverrides={imageOverrides}
                        />
                    </div>
                    <div className="btn-group">
                        <button className="btn generate-btn" onClick={generatePng}>
                            Generate Card
                        </button>
                        &nbsp;
                        <button className="btn get-json-btn" onClick={downloadJson}>
                            Get JSON
                        </button>
                    </div>
                </div>
                <div className="properties-container">
                    <CardPropertiesPanel
                        card={card}
                        onChange={setCard}
                        onConfigureTemplate={openTextEditor}
                        onConfigureFileLayout={openFileEditor}
                    />
                </div>
            </div>
            {editingField && (
                <Modal onClose={cancelTextTemplate}>
                    <TextRegionEditor
                        field={editingField}
                        initial={initialTextRegion(editingField)}
                        onPreviewChange={region => {
                            const key = editingField.toLowerCase() as keyof typeof cardTemplates.default;
                            setOverrides(o => ({ ...o, [key]: region }));
                        }}
                        onSave={saveTextTemplate}
                        onCancel={cancelTextTemplate}
                    />
                </Modal>
            )}
            {editingImageField && (
                <Modal onClose={cancelFileTemplate}>
                    <FileRegionEditor
                        field={editingImageField}
                        initial={initialImageRegion(editingImageField)}
                        onPreviewChange={region =>
                            setImageOverrides(o => ({ ...o, [editingImageField]: region }))
                        }
                        onSave={saveFileTemplate}
                        onCancel={cancelFileTemplate}
                    />
                </Modal>
            )}
        </div>
    );
};

export default SingleCardCreator;
