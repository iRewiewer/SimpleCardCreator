import React, { ChangeEvent } from 'react';
import { FiSettings } from 'react-icons/fi';
import { Card } from '../types';
import '../styles/cardform.css';

interface CardFormProps {
    card: Card;
    onChange: (updated: Card) => void;
    onConfigureTemplate: (field: FieldKey) => void;
}

// must match FieldKey in the page
type FieldKey = 'name' | 'description' | 'ATK' | 'HP' | 'faction' | 'attribute' | 'type' | 'series';

const TEXT_FIELDS: FieldKey[] = [
    'name',
    'description',
    'ATK',
    'HP',
    'faction',
    'attribute',
    'type',
    'series'
];

const CardForm: React.FC<CardFormProps> = ({ card, onChange, onConfigureTemplate }) => {
    const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let val: string | number = value;
        if (name === 'ATK' || name === 'HP') {
            const n = parseInt(value, 10);
            val = isNaN(n) ? 0 : n;
        }
        onChange({ ...card, [name]: val } as Card);
    };

    const handleFile = (e: ChangeEvent<HTMLInputElement>, field: keyof Card) => {
        if (!e.target.files?.[0]) return;
        const f = e.target.files[0];
        const reader = new FileReader();
        reader.onload = ev => {
            onChange({ ...card, [field]: ev.target?.result as string } as Card);
        };
        reader.readAsDataURL(f);
    };

    return (
        <form className="card-form">
            <div className="card-form__fields">
                {TEXT_FIELDS.map(field => (
                    <div key={field} className="card-form__group">
                        <label htmlFor={field}>{field}:</label>
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

            <div className="card-form__uploads">
                {/* your existing 3‑column upload groups */}
                {/* e.g.: */}
                <div className="card-form__upload-group">
                    <label>Faction Image:</label>
                    <input type="file" onChange={e => handleFile(e, 'factionImageUrl')} />
                    {card.factionImageUrl && (
                        <img
                            src={card.factionImageUrl}
                            alt="Faction preview"
                            className="card-form__image-preview"
                        />
                    )}
                </div>
                {/* ...etc... */}
            </div>
        </form>
    );
};

export default CardForm;
