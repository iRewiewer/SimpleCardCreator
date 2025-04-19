// src/pages/BatchCardCreator.tsx

import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Card } from '../types';
import '../styles/batch-card-creator.css';

const BatchCardCreator: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();

    const [cards, setCards] = useState<Card[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');

    const jsonInputRef = useRef<HTMLInputElement | null>(null);
    const filesInputRef = useRef<HTMLInputElement | null>(null);

    const switchToSingleMode = () => projectId && navigate(`/project/${projectId}/single`);
    const handleJsonButtonClick = () => jsonInputRef.current?.click();
    const handleFilesButtonClick = () => filesInputRef.current?.click();

    const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const parsed = JSON.parse(ev.target?.result as string);
                if (!Array.isArray(parsed)) throw new Error('JSON must be an array of cards.');
                const newCards: Card[] = parsed.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    artworkName: item.artworkName,
                    overlay: item.overlay,
                    faction: item.faction,
                    attribute: item.attribute,
                    type: item.type,
                    ATK: item.ATK,
                    HP: item.HP,
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
                setError(err.message || 'Invalid JSON file.');
                setCards([]);
            }
        };
        reader.readAsText(file);
    };

    const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setUploadedFiles(prev => [...prev, ...Array.from(files)]);
    };

    const buildCards = async () => {
        if (!cards.length) return;
        const zip = new JSZip();
        const folder = zip.folder('cards')!;

        const fileToDataUrl = (file: File): Promise<string> => new Promise(res => {
            const reader = new FileReader();
            reader.onload = e => res(e.target?.result as string);
            reader.readAsDataURL(file);
        });
        const loadImage = (url: string): Promise<HTMLImageElement> => new Promise((res, rej) => {
            const img = new Image();
            img.onload = () => res(img);
            img.onerror = rej;
            img.src = url;
        });

        for (const card of cards) {
            const artFile = uploadedFiles.find(f => f.name === card.artworkName);
            const overlayFile = uploadedFiles.find(f => f.name === card.overlay);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            if (artFile) {
                const artUrl = await fileToDataUrl(artFile);
                const artImg = await loadImage(artUrl);
                canvas.width = artImg.width;
                canvas.height = artImg.height;
                ctx.drawImage(artImg, 0, 0);
            }
            if (overlayFile) {
                const ovUrl = await fileToDataUrl(overlayFile);
                const ovImg = await loadImage(ovUrl);
                ctx.drawImage(ovImg, 0, 0, canvas.width, canvas.height);
            }
            ctx.fillStyle = 'white';
            ctx.font = '24px sans-serif';
            ctx.fillText(card.name, 20, 40);
            ctx.font = '20px sans-serif';
            ctx.fillText(`ATK: ${card.ATK}`, 20, canvas.height - 60);
            ctx.fillText(`HP: ${card.HP}`, 20, canvas.height - 30);
            ctx.font = '16px sans-serif';
            card.description.split('\n').forEach((line, i) => ctx.fillText(line, 20, canvas.height - 90 - i * 20));

            const blob = await new Promise<Blob>(resolve => canvas.toBlob(resolve as any)!);
            const filename = card.artworkName.replace(/\..+$/, '.png');
            folder.file(filename, blob);
        }

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `project-${projectId}-cards.zip`);
    };

    return (
        <div className="batch-container">
            <h2>Batch Card Creator</h2>
            <div className="mode-switch">
                <button className="btn" onClick={switchToSingleMode}>Single Card Mode</button>
                <button className="btn">Batch Mode</button>
            </div>

            <p>Project ID: {projectId}</p>

            <div className="upload-controls">
                <button className="btn" onClick={handleJsonButtonClick}>Upload JSON</button>
                <button className="btn" onClick={handleFilesButtonClick}>Upload Files</button>
                <input type="file" accept=".json" ref={jsonInputRef} className="hidden-input" onChange={handleJsonUpload} />
                <input type="file" accept="image/*" multiple ref={filesInputRef} className="hidden-input" onChange={handleFilesUpload} />
            </div>

            {error && <div className="error">{error}</div>}

            <h3>Cards</h3>
            <div className="table-wrapper">
                <table className="cards-table">
                    <thead>
                        <tr>
                            <th>ID</th><th>Name</th><th>Type</th><th>Faction</th><th>Attribute</th>
                            <th>Description</th><th>ATK</th><th>HP</th><th>Artwork</th><th>Overlay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cards.map((card, i) => (
                            <tr key={i}>
                                <td>{card.id}</td>
                                <td>{card.name}</td>
                                <td>{card.type}</td>
                                <td>{card.faction}</td>
                                <td>{card.attribute}</td>
                                <td>{card.description}</td>
                                <td>{card.ATK}</td>
                                <td>{card.HP}</td>
                                <td>{card.artworkName}</td>
                                <td>{card.overlay}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {uploadedFiles.length > 0 && (
                <div className="uploaded-files">
                    <h4>Uploaded Files</h4>
                    <ul>
                        {uploadedFiles.map((file, idx) => <li key={idx}>{file.name}</li>)}
                    </ul>
                </div>
            )}

            <button className="btn build-btn" onClick={buildCards}>Build</button>
        </div>
    );
};

export default BatchCardCreator;
