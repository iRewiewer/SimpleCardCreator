// src/pages/BatchCardCreator.tsx

import React, { useRef, useState, ChangeEvent } from 'react';
import { flushSync } from 'react-dom';
import html2canvas from 'html2canvas';
import CardPreview from '../components/CardPreview';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Card } from '../types';
import { mergeCardJson } from '../utils/mergeJson';
import '../styles/batch-card-creator.css';
import { createRoot } from 'react-dom/client';

const BatchCardCreator: React.FC = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [error, setError] = useState<string>('');
    const jsonInputRef = useRef<HTMLInputElement | null>(null);

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

    const assignIds = (arr: Card[]) =>
        arr.map((c, i) => ({ ...c, id: i + 1 }));

    const handleJsonUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const file = input.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const parsed = JSON.parse(ev.target?.result as string);
                const arr = Array.isArray(parsed) ? parsed : [parsed];
                const newCards = arr.map(item => mergeCardJson(initialCard, item).card);
                setCards(prev => assignIds([...prev, ...newCards]));
                setError('');
            } catch (err: any) {
                setError(err.message || 'Invalid JSON');
            }
        };
        reader.readAsText(file);
        input.value = '';
    };

    const clearAll = () => {
        setCards([]);
        setError('');
    };

    const buildCards = async () => {
        if (!cards.length) return;
        const zip = new JSZip();
        const folder = zip.folder('cards')!;

        for (const cardData of cards) {
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.top = '-9999px';
            container.style.left = '-9999px';
            document.body.appendChild(container);

            const root = createRoot(container);
            flushSync(() => {
                root.render(<CardPreview
                    card={cardData}
                    templateOverrides={{}}
                    imageOverrides={{}}
                />);
            });

            const canvas = await html2canvas(container, { scale: 1, useCORS: true });
            root.unmount();
            document.body.removeChild(container);

            const blob = await new Promise<Blob | null>(resolve =>
                canvas.toBlob(resolve as any)
            );
            if (!blob) throw new Error('canvas.toBlob returned null');

            let filename = cardData.artworkName.replace(/\..+$/, '').trim();
            if (!filename) filename = `${cardData.id}-${cardData.name}`;
            folder.file(`${filename}.png`, blob);
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, `cards-${timestamp}.zip`);
    };

    const exportJson = () => {
        if (!cards.length) return;
        const data = JSON.stringify(cards, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        saveAs(blob, `cards-${timestamp}.json`);
    };

    return (
        <div className="batch-container">
            <h2>Batch Card Creator</h2>
            <div className="upload-controls">
                <button className="btn" onClick={() => jsonInputRef.current?.click()}>
                    Add Card(s) JSON
                </button>
                <button className="btn build-btn-top" onClick={buildCards}>
                    Build
                </button>
                <button className="btn export-btn" onClick={exportJson}>
                    Export JSON
                </button>
                <button className="btn clear-btn" onClick={clearAll}>
                    Clear All Fields
                </button>
                <input
                    type="file"
                    accept=".json"
                    ref={jsonInputRef}
                    className="hidden-input"
                    onChange={handleJsonUpload}
                />
            </div>
            {error && <div className="error">{error}</div>}
            <h3>Cards</h3>
            <div className="table-wrapper">
                <table className="cards-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>Preview</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Faction</th>
                            <th>Attribute</th>
                            <th>Description</th>
                            <th>ATK</th>
                            <th>HP</th>
                            <th>Card Img</th>
                            <th>Overlay Img</th>
                            <th>Faction Img</th>
                            <th>Type Img</th>
                            <th>Attribute Img</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cards.map((c, i) => (
                            <tr key={i}>
                                <td>
                                    <button className="btn" onClick={() =>
                                        setCards(cs => assignIds(cs.filter((_, idx) => idx !== i)))
                                    }>
                                        X
                                    </button>
                                </td>
                                <td>{c.id}</td>
                                <td>
                                    <div className="preview-cell">
                                        <CardPreview
                                            card={c}
                                            templateOverrides={{}}
                                            imageOverrides={{}}
                                        />
                                    </div>
                                </td>
                                <td>{c.name}</td>
                                <td>{c.type}</td>
                                <td>{c.faction}</td>
                                <td>{c.attribute}</td>
                                <td>{c.description}</td>
                                <td>{c.ATK}</td>
                                <td>{c.HP}</td>
                                <td><div className="img-cell"><img src={c.cardImageUrl} alt="card" /></div></td>
                                <td><div className="img-cell"><img src={c.overlayImageUrl} alt="overlay" /></div></td>
                                <td><div className="img-cell"><img src={c.factionImageUrl} alt="faction" /></div></td>
                                <td><div className="img-cell"><img src={c.typeImageUrl} alt="type" /></div></td>
                                <td><div className="img-cell"><img src={c.attributeImageUrl} alt="attribute" /></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn build-btn-bot" onClick={buildCards}>
                Build
            </button>
        </div>
    );
};

export default BatchCardCreator;
