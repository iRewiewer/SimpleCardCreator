// src/pages/SingleCardCreator.tsx

import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import CardPreview from '../components/CardPreview';
import CardPropertiesPanel, { FieldKey, FileFieldKey } from '../components/CardPropertiesPanel';
import Modal from '../components/Modal';
import TextRegionEditor from '../components/TextRegionEditor';
import FileRegionEditor from '../components/FileRegionEditor';
import { Card, TextRegion } from '../types';
import { cardTemplates } from '../types/cardTemplates';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { mergeCardJson } from '../utils/mergeJson';
import { Switch } from '@headlessui/react';
import '../styles/single-card-creator.css';

const STORAGE_KEY = 'singleCardCreatorData';

type JsonMode = 'blob' | 'filename';

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
    const [jsonMode, setJsonMode] = useState<JsonMode>('filename');
    const [didLoad, setDidLoad] = useState(false);

    // editor state
    const [editingField, setEditingField] = useState<FieldKey | null>(null);
    const [savedRegion, setSavedRegion] = useState<TextRegion | undefined>(undefined);
    const [editingImageField, setEditingImageField] = useState<FileFieldKey | null>(null);
    const [savedImageRegion, setSavedImageRegion] = useState<TextRegion | undefined>(undefined);

    // JSON load state
    const jsonFileInputRef = useRef<HTMLInputElement | null>(null);
    const [showPasteModal, setShowPasteModal] = useState(false);
    const [pasteJson, setPasteJson] = useState('');

    // load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const { card, overrides, imageOverrides, jsonMode } = JSON.parse(stored);
                setCard(card);
                setOverrides(overrides);
                setImageOverrides(imageOverrides);
                setJsonMode(jsonMode || 'filename');
            } catch {
                // ignore parse errors
            }
        }
        setDidLoad(true);
    }, []);

    // save to localStorage whenever relevant state changes
    useEffect(() => {
        if (!didLoad) return;
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ card, overrides, imageOverrides, jsonMode })
        );
    }, [didLoad, card, overrides, imageOverrides, jsonMode]);

    // --- JSON load from file ---
    const handleJsonFileLoad = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const parsed = JSON.parse(ev.target?.result as string);
                setCard(c => mergeCardJson(c, parsed));
            } catch {
                alert('Invalid JSON');
            }
        };
        reader.readAsText(file);
    };

    // --- JSON load from paste ---
    const handlePasteLoad = () => {
        try {
            const parsed = JSON.parse(pasteJson);
            setCard(c => mergeCardJson(c, parsed));
            setShowPasteModal(false);
            setPasteJson('');
        } catch {
            alert('Invalid JSON');
        }
    };

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

    // --- Download JSON with full region data ---
    const downloadJson = () => {
        const textFields: FieldKey[] = [
            'name', 'description', 'ATK', 'HP', 'faction', 'attribute', 'type', 'series'
        ];
        const fileFields: FileFieldKey[] = [
            'faction', 'type', 'attribute', 'card', 'overlay'
        ];

        // start with card ID
        const exportObj: Record<string, any> = { id: card.id };

        // include text regions (value + layout/styling)
        textFields.forEach(field => {
            const key = field.toLowerCase() as keyof typeof cardTemplates.default;
            const baseRegion = cardTemplates.default[key];
            const userRegion = overrides[key] || {};
            // merge layout + any user overrides
            const region = { ...baseRegion, ...userRegion };

            exportObj[field] = {
                text: (card as any)[field],

                // layout
                x: region.x,
                y: region.y,
                maxWidth: region.maxWidth,
                maxHeight: region.maxHeight,

                // styling
                color: region.color ?? '#000000',
                fontSize: region.fontSize ?? 16,
                textDecoration: region.textDecoration ?? [],
                textAlign: region.textAlign ?? 'left',

                // which font‐file to use
                fontFile: (card as any)[`${field}FontUrl`],
            };
        });


        // include file regions (filename + layout)
        fileFields.forEach(field => {
            const nameKey = `${field}Name` as keyof Card;
            const blobKey = `${field}ImageUrl` as keyof Card;
            const baseRegion = DEFAULT_IMAGE_REGION;
            const userRegion = imageOverrides[field] || {};
            const region = { ...baseRegion, ...userRegion };

            exportObj[field] = {
                fileData: jsonMode === 'filename'
                    ? (card as any)[nameKey]   // e.g. "Disarm.png"
                    : (card as any)[blobKey],  // e.g. "data:image/png;base64,…"
                x: region.x,
                y: region.y,
                maxWidth: region.maxWidth,
                maxHeight: region.maxHeight,
            };
        });

        const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
        saveAs(blob, `${card.name || 'card'}.json`);
    };

    // --- Clear All: reset state & storage ---
    const clearAll = () => {
        setCard(initialCard);
        setOverrides({});
        setImageOverrides({});
        setJsonMode('filename');
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <div className="single-container">
            <div className="top-actions">
                <button className="btn" onClick={() => jsonFileInputRef.current?.click()}>
                    Load JSON from File
                </button>
                &nbsp;&nbsp;
                <button className="btn" onClick={() => setShowPasteModal(true)}>
                    Load JSON
                </button>
                &nbsp;&nbsp;
                <button className="btn clear-btn" onClick={clearAll}>
                    Clear All Fields
                </button>
                <input
                    type="file"
                    accept=".json"
                    ref={jsonFileInputRef}
                    className="hidden-input"
                    onChange={handleJsonFileLoad}
                />
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

                    <div className="json-mode-selector">
                        <span className="json-mode-label">Image Blob</span>
                        <Switch
                            data-state={jsonMode === 'filename' ? 'checked' : 'unchecked'}
                            checked={jsonMode === 'filename'}
                            onChange={val => setJsonMode(val ? 'filename' : 'blob')}
                            className="json-mode-switch"
                        >
                            <span className="json-mode-thumb" aria-hidden="true" />
                        </Switch>
                        <span className="json-mode-label">Image Filename</span>
                    </div>

                    <div className="btn-group">
                        <button className="btn generate-btn" onClick={generatePng}>
                            Generate Card
                        </button>
                        &nbsp;&nbsp;&nbsp;
                        <button className="btn get-json-btn" onClick={downloadJson}>
                            Generate JSON
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

            {showPasteModal && (
                <Modal onClose={() => setShowPasteModal(false)}>
                    <h2>Paste in your JSON</h2>
                    <textarea
                        value={pasteJson}
                        onChange={e => setPasteJson(e.target.value)}
                        rows={10}
                        style={{ width: '100%', boxSizing: 'border-box', resize: 'none' }}
                    />
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <button className="btn" onClick={handlePasteLoad}>
                            Load
                        </button>
                    </div>
                </Modal>
            )}

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
                        onPreviewChange={region => setImageOverrides(o => ({ ...o, [editingImageField]: region }))}
                        onSave={saveFileTemplate}
                        onCancel={cancelFileTemplate}
                    />
                </Modal>
            )}
        </div>
    );
};

export default SingleCardCreator;
