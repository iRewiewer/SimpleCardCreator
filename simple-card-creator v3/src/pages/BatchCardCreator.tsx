// src/pages/BatchCardCreator.tsx

import React, { useRef, useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Card } from '../types';
import '../styles/batch-card-creator.css';

const BatchCardCreator: React.FC = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');

    const jsonInputRef = useRef<HTMLInputElement | null>(null);
    const filesInputRef = useRef<HTMLInputElement | null>(null);

    // Load JSON
    const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const parsed = JSON.parse(ev.target?.result as string);
                if (!Array.isArray(parsed)) throw new Error('JSON must be an array');

                const newCards: Card[] = parsed.map((item: any) => ({
                    id: item.id,
                    name: item.name || '',
                    description: item.description || '',
                    artworkName: item.artworkName || '',
                    overlay: item.overlay || '',
                    faction: item.faction || '',
                    attribute: item.attribute || '',
                    type: item.type || 'Unit',
                    ATK: item.ATK ?? 0,
                    HP: item.HP ?? 0,
                    series: item.series || '',
                    nameFontUrl: '',
                    descriptionFontUrl: '',
                    atkFontUrl: '',
                    hpFontUrl: '',
                    factionImageUrl: '',
                    typeImageUrl: '',
                    attributeImageUrl: '',
                    cardImageUrl: '',
                    overlayImageUrl: '',
                }));

                setCards(newCards);
                setError('');
            } catch (err: any) {
                setError(err.message || 'Invalid JSON');
                setCards([]);
            }
        };
        reader.readAsText(file);
    };

    // Handle image uploads
    const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const arr: File[] = [];
        for (let i = 0; i < files.length; i++) {
            const f = files.item(i);
            if (f) arr.push(f);
        }
        setUploadedFiles(prev => [...prev, ...arr]);
    };

    // Build & download ZIP
    const buildCards = async () => {
        if (!cards.length) return;
        const zip = new JSZip();
        const folder = zip.folder('cards')!;

        const fileToDataUrl = (file: File): Promise<string> =>
            new Promise(res => {
                const r = new FileReader();
                r.onload = e => res(e.target?.result as string);
                r.readAsDataURL(file);
            });
        const loadImage = (url: string): Promise<HTMLImageElement> =>
            new Promise((res, rej) => {
                const img = new Image();
                img.onload = () => res(img);
                img.onerror = rej;
                img.src = url;
            });

        for (const card of cards) {
            // find files by name
            const artFile = uploadedFiles.find(f => f.name === card.artworkName);
            const ovFile = uploadedFiles.find(f => f.name === card.overlay);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            if (artFile) {
                const artUrl = await fileToDataUrl(artFile);
                const artImg = await loadImage(artUrl);
                canvas.width = artImg.width;
                canvas.height = artImg.height;
                ctx.drawImage(artImg, 0, 0);
            }
            if (ovFile) {
                const ovUrl = await fileToDataUrl(ovFile);
                const ovImg = await loadImage(ovUrl);
                ctx.drawImage(ovImg, 0, 0, canvas.width, canvas.height);
            }

            const blob = await new Promise<Blob>(r => canvas.toBlob(r as any)!);
            const name = card.artworkName.replace(/\..+$/, '') + '.png';
            folder.file(name, blob);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, `batch-cards-${Date.now()}.zip`);
    };

    return (
        <div className="batch-container">
            <h2>Batch Card Creator</h2>

            <div className="upload-controls">
                <button className="btn" onClick={() => jsonInputRef.current?.click()}>
                    Upload JSON
                </button>
                <button className="btn" onClick={() => filesInputRef.current?.click()}>
                    Upload Files
                </button>
                <input
                    type="file"
                    accept=".json"
                    ref={jsonInputRef}
                    className="hidden-input"
                    onChange={handleJsonUpload}
                />
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={filesInputRef}
                    className="hidden-input"
                    onChange={handleFilesUpload}
                />
            </div>

            {error && <div className="error">{error}</div>}

            <h3>Cards</h3>
            <div className="table-wrapper">
                <table className="cards-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Faction</th>
                            <th>Attribute</th>
                            <th>Description</th>
                            <th>ATK</th>
                            <th>HP</th>
                            <th>Artwork</th>
                            <th>Overlay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cards.map((c, i) => (
                            <tr key={i}>
                                <td>{c.id}</td>
                                <td>{c.name}</td>
                                <td>{c.type}</td>
                                <td>{c.faction}</td>
                                <td>{c.attribute}</td>
                                <td>{c.description}</td>
                                <td>{c.ATK}</td>
                                <td>{c.HP}</td>
                                <td>{c.artworkName}</td>
                                <td>{c.overlay}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button className="btn build-btn" onClick={buildCards}>
                Build
            </button>
        </div>
    );
};

export default BatchCardCreator;
