import React, { useRef, useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Card } from '../types';
import {
    cardTemplates,
    TextRegion,
    TextDecoration,
    TextAlign
} from '../config/cardTemplates';
import '../styles/batch-card-creator.css';

const BatchCardCreator: React.FC = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');
    const jsonInputRef = useRef<HTMLInputElement | null>(null);
    const filesInputRef = useRef<HTMLInputElement | null>(null);

    const handleJsonButtonClick = () => {
        jsonInputRef.current?.click();
    };

    const handleFilesButtonClick = () => {
        filesInputRef.current?.click();
    };

    const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const parsed = JSON.parse(ev.target?.result as string);
                if (!Array.isArray(parsed)) {
                    throw new Error('JSON must be an array of cards.');
                }
                const newCards: Card[] = parsed.map((item: any) => ({
                    id: item.id,
                    name: item.name || '',
                    description: item.description || '',
                    ATK: item.ATK || 0,
                    HP: item.HP || 0,
                    artworkName: item.artworkName || '',
                    overlay: item.overlay || '',
                    faction: item.faction || '',
                    attribute: item.attribute || '',
                    type: item.type || '',
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

    const fileToDataUrl = (file: File): Promise<string> =>
        new Promise(res => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result as string);
            reader.readAsDataURL(file);
        });

    const loadImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((res, rej) => {
            const img = new Image();
            img.onload = () => res(img);
            img.onerror = rej;
            img.src = url;
        });

    const drawTextToFit = (
        ctx: CanvasRenderingContext2D,
        text: string,
        region: TextRegion
    ) => {
        const lines = text.split('\n');
        let fontSize = region.fontSize ?? region.maxHeight;
        ctx.textBaseline = 'top';

        // build font style prefix
        const decos = region.textDecoration ?? [];
        const stylePrefix = [
            decos.includes(TextDecoration.Italic) ? 'italic' : '',
            decos.includes(TextDecoration.Bold) ? 'bold' : ''
        ].filter(s => s).join(' ');

        // shrink until it fits both width and height
        while (fontSize > 0) {
            ctx.font = `${stylePrefix} ${fontSize}px sans-serif`;
            const fitsWidth = lines.every(l => ctx.measureText(l).width <= region.maxWidth);
            const fitsHeight = fontSize * lines.length <= region.maxHeight;
            if (fitsWidth && fitsHeight) break;
            fontSize--;
        }

        ctx.fillStyle = region.color ?? '#000';

        lines.forEach((line, i) => {
            const y = region.y + i * fontSize;

            if (
                region.textAlign === TextAlign.Justify &&
                line.includes(' ') &&
                i < lines.length - 1
            ) {
                // justify (not last line)
                const words = line.split(' ');
                const measured = ctx.measureText(line).width;
                const extraSpace = (region.maxWidth - measured) / (words.length - 1);
                let x = region.x;
                ctx.textAlign = 'left';
                words.forEach(w => {
                    ctx.fillText(w, x, y);
                    x += ctx.measureText(w).width + extraSpace;
                });
            } else {
                // left/center/right
                let x: number;
                switch (region.textAlign) {
                    case TextAlign.Center:
                        ctx.textAlign = 'center';
                        x = region.x + region.maxWidth / 2;
                        break;
                    case TextAlign.Right:
                        ctx.textAlign = 'right';
                        x = region.x + region.maxWidth;
                        break;
                    default:
                        ctx.textAlign = 'left';
                        x = region.x;
                }
                ctx.fillText(line, x, y, region.maxWidth);

                // underline if requested
                if (decos.includes(TextDecoration.Underlined)) {
                    const w = ctx.measureText(line).width;
                    const uy = y + fontSize;
                    ctx.beginPath();
                    ctx.moveTo(
                        x -
                        (ctx.textAlign === 'center'
                            ? w / 2
                            : ctx.textAlign === 'right'
                                ? w
                                : 0),
                        uy
                    );
                    ctx.lineTo(
                        x +
                        (ctx.textAlign === 'center'
                            ? w / 2
                            : 0),
                        uy
                    );
                    ctx.lineWidth = Math.max(1, fontSize * 0.05);
                    ctx.strokeStyle = region.color ?? '#000';
                    ctx.stroke();
                }
            }
        });
    };

    const buildCards = async () => {
        if (cards.length === 0) return;
        const zip = new JSZip();
        const folder = zip.folder('cards')!;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        for (const card of cards) {
            const artFile = uploadedFiles.find(f => f.name === card.artworkName);
            if (!artFile) {
                console.warn(`Missing artwork: ${card.artworkName}`);
                continue;
            }

            // draw base artwork
            const artDataUrl = await fileToDataUrl(artFile);
            const artImg = await loadImage(artDataUrl);
            canvas.width = artImg.width;
            canvas.height = artImg.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(artImg, 0, 0);

            // draw overlay
            if (card.overlay) {
                const ovFile = uploadedFiles.find(f => f.name === card.overlay);
                if (ovFile) {
                    const ovDataUrl = await fileToDataUrl(ovFile);
                    const ovImg = await loadImage(ovDataUrl);
                    ctx.drawImage(ovImg, 0, 0, canvas.width, canvas.height);
                }
            }

            // draw text regions
            const tmpl = cardTemplates[card.type] || cardTemplates.default;
            tmpl.name && drawTextToFit(ctx, card.name, tmpl.name);
            tmpl.description && drawTextToFit(ctx, card.description, tmpl.description);
            tmpl.atk && drawTextToFit(ctx, String(card.ATK), tmpl.atk);
            tmpl.hp && drawTextToFit(ctx, String(card.HP), tmpl.hp);
            tmpl.faction && drawTextToFit(ctx, card.faction, tmpl.faction);
            tmpl.attribute && drawTextToFit(ctx, card.attribute, tmpl.attribute);
            tmpl.type && drawTextToFit(ctx, card.type, tmpl.type);
            tmpl.series && drawTextToFit(ctx, card.series, tmpl.series);

            // export PNG
            const blob = await new Promise<Blob>(res =>
                canvas.toBlob(b => res(b!), 'image/png')
            );
            const filename = card.artworkName.replace(/\.[^.]+$/, '.png');
            folder.file(filename, blob);
        }

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'cards.zip');
    };

    return (
        <div className="batch-container">
            <div className="upload-controls">
                <button className="btn" onClick={handleJsonButtonClick}>
                    Upload JSON
                </button>
                <button className="btn" onClick={handleFilesButtonClick}>
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
                            <th>Series</th>
                            <th>Description</th>
                            <th>ATK</th>
                            <th>HP</th>
                            <th>Artwork</th>
                            <th>Overlay</th>
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
                                <td>{card.series}</td>
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
                    <div className="uploaded-files-grid">
                        {uploadedFiles.map((file, idx) => (
                            <div key={idx} className="uploaded-file-item">
                                {file.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button className="btn build-btn" onClick={buildCards}>
                Build
            </button>
        </div>
    );
};

export default BatchCardCreator;
