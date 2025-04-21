// src/components/TextRegionEditor.tsx

import React, { useState, ChangeEvent } from 'react';
import { TextRegion, TextDecoration, TextAlign } from '../types';
import '../styles/text-region-editor.css';

interface TextRegionEditorProps {
    field: string;
    initial: TextRegion;
    onSave: (region: TextRegion) => void;
    onCancel: () => void;
    onPreviewChange?: (region: TextRegion) => void;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const TextRegionEditor: React.FC<TextRegionEditorProps> = ({
    field,
    initial,
    onSave,
    onCancel,
    onPreviewChange
}) => {
    const [region, setRegion] = useState<TextRegion>(initial);

    const update = <K extends keyof TextRegion>(key: K, value: TextRegion[K]) => {
        const next = { ...region, [key]: value };
        setRegion(next);
        onPreviewChange?.(next);
    };

    const toggleDecoration = (dec: TextDecoration) => {
        const decos = region.textDecoration ?? [];
        const next = decos.includes(dec)
            ? decos.filter(d => d !== dec)
            : [...decos, dec];
        update('textDecoration', next);
    };

    return (
        <div className="editor-overlay">
            <div className="editor-panel">
                <h2>Configure “{capitalize(field)}”</h2>

                {(['x', 'y', 'maxWidth', 'maxHeight'] as (keyof TextRegion)[]).map(k => (
                    <div key={k} className="editor-row">
                        <label>{capitalize(k)}:</label>
                        <input
                            type="number"
                            value={region[k] as number}
                            onChange={e => update(k, +e.target.value as any)}
                        />
                    </div>
                ))}

                {/* NEW: custom file‑input wrapper */}
                <div className="editor-row file-row">
                    <label>Font File:</label>
                    <div className="file-input-wrapper">
                        <input
                            type="file"
                            accept=".ttf,.otf,.woff,.woff2"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                const reader = new FileReader();
                                reader.onload = ev => {
                                    update('fontUrl', ev.target?.result as string);
                                    update('fontName', f.name);
                                };
                                reader.readAsDataURL(f);
                            }}
                        />
                        <span className="file-name">
                            {region.fontName || 'No font chosen'}
                        </span>
                    </div>
                </div>

                <div className="editor-row">
                    <label>Color:</label>
                    <input
                        type="color"
                        value={region.color ?? '#000000'}
                        onChange={e => update('color', e.target.value)}
                    />
                </div>

                <div className="editor-row">
                    <label>Font Size:</label>
                    <input
                        type="number"
                        value={region.fontSize ?? 16}
                        onChange={e => update('fontSize', +e.target.value)}
                    />
                </div>

                <fieldset className="editor-fieldset">
                    <legend>Text Decoration</legend>
                    {Object.values(TextDecoration).map(dec => (
                        <label key={dec}>
                            <input
                                type="checkbox"
                                checked={(region.textDecoration ?? []).includes(dec)}
                                onChange={() => toggleDecoration(dec)}
                            />
                            {capitalize(dec.toLowerCase())}
                        </label>
                    ))}
                </fieldset>

                <div className="editor-row">
                    <label>Text Align:</label>
                    <select
                        value={region.textAlign ?? TextAlign.Left}
                        onChange={e => update('textAlign', e.target.value as TextAlign)}
                    >
                        {Object.values(TextAlign).map(a => (
                            <option key={a} value={a}>
                                {capitalize(a)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="editor-actions">
                    <button onClick={() => onSave(region)}>Save</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default TextRegionEditor;
