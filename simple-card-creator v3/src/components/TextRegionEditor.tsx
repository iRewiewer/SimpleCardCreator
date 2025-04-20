import React, { useState } from 'react';
import { TextRegion, TextDecoration, TextAlign } from '../config/cardTemplates';
import '../styles/text-region-editor.css';

interface TextRegionEditorProps {
    field: string;
    initial: TextRegion;
    onSave: (region: TextRegion) => void;
    onCancel: () => void;
}

const TextRegionEditor: React.FC<TextRegionEditorProps> = ({
    field,
    initial,
    onSave,
    onCancel
}) => {
    const [region, setRegion] = useState<TextRegion>(initial);

    const update = <K extends keyof TextRegion>(key: K, value: TextRegion[K]) => {
        setRegion(r => ({ ...r, [key]: value }));
    };

    const toggleDecoration = (dec: TextDecoration) => {
        const decos = region.textDecoration ?? [];
        const has = decos.includes(dec);
        const next = has ? decos.filter(d => d !== dec) : [...decos, dec];
        update('textDecoration', next);
    };

    return (
        <div className="editor-overlay">
            <div className="editor-panel">
                <h2>Configure “{field}”</h2>

                <div className="editor-row">
                    <label>X:</label>
                    <input
                        type="number"
                        value={region.x}
                        onChange={e => update('x', +e.target.value)}
                    />
                </div>
                <div className="editor-row">
                    <label>Y:</label>
                    <input
                        type="number"
                        value={region.y}
                        onChange={e => update('y', +e.target.value)}
                    />
                </div>
                <div className="editor-row">
                    <label>Max Width:</label>
                    <input
                        type="number"
                        value={region.maxWidth}
                        onChange={e => update('maxWidth', +e.target.value)}
                    />
                </div>
                <div className="editor-row">
                    <label>Max Height:</label>
                    <input
                        type="number"
                        value={region.maxHeight}
                        onChange={e => update('maxHeight', +e.target.value)}
                    />
                </div>

                <div className="editor-row">
                    <label>Font File:</label>
                    <input
                        type="file"
                        accept=".ttf,.otf,.woff,.woff2"
                        onChange={e => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            const reader = new FileReader();
                            reader.onload = ev => {
                                update('fontSize', region.fontSize); // keep fontSize
                                update('color', region.color ?? '#000000'); // keep color
                                // store file URL in fontUrl field
                                // Note: if your TextRegion has a fontUrl key
                                // use update('fontUrl', ev.target?.result as string)
                            };
                            reader.readAsDataURL(f);
                        }}
                    />
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
                            {dec}
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
                            <option key={a} value={a}>{a}</option>
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
