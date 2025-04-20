import React, { useState } from 'react';
import { TextRegion } from '../types';
import '../styles/file-region-editor.css';

interface FileRegionEditorProps {
    field: string;
    initial: TextRegion;
    onPreviewChange?: (region: TextRegion) => void;  // NEW
    onSave: (region: TextRegion) => void;
    onCancel: () => void;
}

const capitalize = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1);

const FileRegionEditor: React.FC<FileRegionEditorProps> = ({
    field, initial, onPreviewChange, onSave, onCancel
}) => {
    const [region, setRegion] = useState<TextRegion>(initial);

    const update = <K extends keyof TextRegion>(key: K, value: TextRegion[K]) => {
        const next = { ...region, [key]: value };
        setRegion(next);
        onPreviewChange?.(next);  // fire live preview
    };

    return (
        <div className="editor-overlay">
            <div className="editor-panel">
                <h2>Configure {capitalize(field)} Image</h2>

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

                <div className="editor-actions">
                    <button onClick={() => onSave(region)}>Save</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default FileRegionEditor;
