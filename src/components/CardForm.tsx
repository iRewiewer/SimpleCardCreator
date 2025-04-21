// src/components/CardForm.tsx

import React, { ChangeEvent } from 'react';
import { FiSettings } from 'react-icons/fi';
import { Card } from '../types';
import '../styles/cardform.css';

/** Text‐only fields you can lay out */
export type FieldKey =
    | 'name'
    | 'description'
    | 'ATK'
    | 'HP'
    | 'faction'
    | 'attribute'
    | 'type'
    | 'series';

/** File inputs you can lay out */
export type FileFieldKey =
    | 'faction'
    | 'type'
    | 'attribute'
    | 'card'
    | 'overlay';

interface CardFormProps {
    card: Card;
    onChange: (updated: Card) => void;
    onConfigureTemplate: (field: FieldKey) => void;
    onConfigureFileLayout?: (field: FileFieldKey) => void;
}

const TEXT_FIELDS: FieldKey[] = [
    'name',
    'description',
    'ATK',
    'HP',
    'faction',
    'attribute',
    'type',
    'series',
];

const displayLabel = (field: string) =>
    field === 'ATK' || field === 'HP'
        ? field
        : field.charAt(0).toUpperCase() + field.slice(1);

const CardForm: React.FC<CardFormProps> = ({
    card,
    onChange,
    onConfigureTemplate,
    onConfigureFileLayout,
}) => {
    const handleTextChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        let val: string | number = value;
        if (name === 'ATK' || name === 'HP') {
            const n = parseInt(value, 10);
            val = isNaN(n) ? 0 : n;
        }
        onChange({ ...card, [name]: val } as Card);
    };

    const handleFile = (e: ChangeEvent<HTMLInputElement>, field: keyof Card) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const nameKey = (field.replace(
                'ImageUrl',
                'Name',
            ) as keyof Card) as keyof typeof card;
            onChange({
                ...card,
                [field]: ev.target?.result as string,
                [nameKey]: file.name,
            } as Card);
        };
        reader.readAsDataURL(file);
    };

    return (
        <form className="card-form">
            <div className="card-form__fields">
                {TEXT_FIELDS.map(field => (
                    <div key={field} className="card-form__group">
                        <label htmlFor={field}>{displayLabel(field)}</label>
                        {field === 'description' ? (
                            <textarea
                                id={field}
                                name={field}
                                value={String(card[field] ?? '')}
                                onChange={handleTextChange}
                            />
                        ) : (
                            <input
                                id={field}
                                name={field}
                                type={field === 'ATK' || field === 'HP' ? 'number' : 'text'}
                                value={String(card[field] ?? '')}
                                onChange={handleTextChange}
                            />
                        )}
                        <button
                            type="button"
                            className="card-form__cfg-btn"
                            onClick={() => onConfigureTemplate(field)}
                            title="Configure layout"
                        >
                            <FiSettings />
                        </button>
                    </div>
                ))}
            </div>

            <hr className="card-form__divider" />
            <h4 className="card-form__files-title">Files</h4>

            <div className="card-form__uploads">
                <div className="card-form__upload-group">
                    <label>Faction Image</label>
                    <input
                        type="file"
                        onChange={e => handleFile(e, 'factionImageUrl')}
                    />
                    {card.factionImageUrl && (
                        <img
                            src={card.factionImageUrl}
                            alt="Faction preview"
                            className="card-form__image-preview"
                        />
                    )}
                    {onConfigureFileLayout && (
                        <button
                            type="button"
                            className="card-form__cfg-btn"
                            onClick={() => onConfigureFileLayout('faction')}
                            title="Configure layout"
                        >
                            <FiSettings />
                        </button>
                    )}
                </div>

                <div className="card-form__upload-group">
                    <label>Type Image</label>
                    <input
                        type="file"
                        onChange={e => handleFile(e, 'typeImageUrl')}
                    />
                    {card.typeImageUrl && (
                        <img
                            src={card.typeImageUrl}
                            alt="Type preview"
                            className="card-form__image-preview"
                        />
                    )}
                    {onConfigureFileLayout && (
                        <button
                            type="button"
                            className="card-form__cfg-btn"
                            onClick={() => onConfigureFileLayout('type')}
                            title="Configure layout"
                        >
                            <FiSettings />
                        </button>
                    )}
                </div>

                <div className="card-form__upload-group">
                    <label>Attribute Image</label>
                    <input
                        type="file"
                        onChange={e => handleFile(e, 'attributeImageUrl')}
                    />
                    {card.attributeImageUrl && (
                        <img
                            src={card.attributeImageUrl}
                            alt="Attribute preview"
                            className="card-form__image-preview"
                        />
                    )}
                    {onConfigureFileLayout && (
                        <button
                            type="button"
                            className="card-form__cfg-btn"
                            onClick={() => onConfigureFileLayout('attribute')}
                            title="Configure layout"
                        >
                            <FiSettings />
                        </button>
                    )}
                </div>

                <div className="card-form__upload-group">
                    <label>Card Image</label>
                    <input
                        type="file"
                        onChange={e => handleFile(e, 'cardImageUrl')}
                    />
                    {card.cardImageUrl && (
                        <img
                            src={card.cardImageUrl}
                            alt="Card preview"
                            className="card-form__image-preview"
                        />
                    )}
                    {onConfigureFileLayout && (
                        <button
                            type="button"
                            className="card-form__cfg-btn"
                            onClick={() => onConfigureFileLayout('card')}
                            title="Configure layout"
                        >
                            <FiSettings />
                        </button>
                    )}
                </div>

                <div className="card-form__upload-group">
                    <label>Card Overlay</label>
                    <input
                        type="file"
                        onChange={e => handleFile(e, 'overlayImageUrl')}
                    />
                    {card.overlayImageUrl && (
                        <img
                            src={card.overlayImageUrl}
                            alt="Overlay preview"
                            className="card-form__image-preview"
                        />
                    )}
                    {onConfigureFileLayout && (
                        <button
                            type="button"
                            className="card-form__cfg-btn"
                            onClick={() => onConfigureFileLayout('overlay')}
                            title="Configure layout"
                        >
                            <FiSettings />
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default CardForm;
