import React, { ChangeEvent } from 'react';
import { Card } from '../types';
import '../styles/cardform.css';

interface CardFormProps {
    card: Card;
    onChange: (updatedCard: Card) => void;
}

const CardForm: React.FC<CardFormProps> = ({ card, onChange }) => {
    const handleTextChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        let updatedValue: any = value;
        if (name === 'ATK' || name === 'HP') {
            const num = parseInt(value, 10);
            updatedValue = isNaN(num) ? undefined : num;
        }
        onChange({ ...card, [name]: updatedValue });
    };

    const handleFileChange = (
        e: ChangeEvent<HTMLInputElement>,
        field: keyof Card
    ) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                const dataUrl = ev.target?.result as string;
                onChange({ ...card, [field]: dataUrl });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form className="card-form">
            {/* Name & Font */}
            <div className="card-form__group">
                <label htmlFor="name">Card Name:</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={card.name}
                    onChange={handleTextChange}
                />
                <label htmlFor="nameFontUrl">Font URL:</label>
                <input
                    id="nameFontUrl"
                    name="nameFontUrl"
                    type="text"
                    value={card.nameFontUrl || ''}
                    onChange={handleTextChange}
                />
            </div>

            {/* Description & Font */}
            <div className="card-form__group">
                <label htmlFor="description">Card Description:</label>
                <textarea
                    id="description"
                    name="description"
                    value={card.description}
                    onChange={handleTextChange}
                ></textarea>
                <label htmlFor="descriptionFontUrl">Font URL:</label>
                <input
                    id="descriptionFontUrl"
                    name="descriptionFontUrl"
                    type="text"
                    value={card.descriptionFontUrl || ''}
                    onChange={handleTextChange}
                />
            </div>

            {/* ATK & Font */}
            <div className="card-form__group">
                <label htmlFor="ATK">Card ATK:</label>
                <input
                    id="ATK"
                    name="ATK"
                    type="number"
                    value={card.ATK?.toString() || ''}
                    onChange={handleTextChange}
                />
                <label htmlFor="atkFontUrl">Font URL:</label>
                <input
                    id="atkFontUrl"
                    name="atkFontUrl"
                    type="text"
                    value={card.atkFontUrl || ''}
                    onChange={handleTextChange}
                />
            </div>

            {/* HP & Font */}
            <div className="card-form__group">
                <label htmlFor="HP">Card HP:</label>
                <input
                    id="HP"
                    name="HP"
                    type="number"
                    value={card.HP?.toString() || ''}
                    onChange={handleTextChange}
                />
                <label htmlFor="hpFontUrl">Font URL:</label>
                <input
                    id="hpFontUrl"
                    name="hpFontUrl"
                    type="text"
                    value={card.hpFontUrl || ''}
                    onChange={handleTextChange}
                />
            </div>

            {/* Faction Image */}
            <div className="card-form__group">
                <label>Faction Image:</label>
                <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'factionImageUrl')}
                />
                {card.factionImageUrl && (
                    <img
                        src={card.factionImageUrl}
                        alt="Faction preview"
                        className="card-form__image-preview"
                    />
                )}
            </div>

            {/* Type Image */}
            <div className="card-form__group">
                <label>Type Image:</label>
                <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'typeImageUrl')}
                />
                {card.typeImageUrl && (
                    <img
                        src={card.typeImageUrl}
                        alt="Type preview"
                        className="card-form__image-preview"
                    />
                )}
            </div>

            {/* Attribute Image */}
            <div className="card-form__group">
                <label>Attribute Image:</label>
                <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'attributeImageUrl')}
                />
                {card.attributeImageUrl && (
                    <img
                        src={card.attributeImageUrl}
                        alt="Attribute preview"
                        className="card-form__image-preview"
                    />
                )}
            </div>

            {/* Card Image */}
            <div className="card-form__group">
                <label>Card Image:</label>
                <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'cardImageUrl')}
                />
                {card.cardImageUrl && (
                    <img
                        src={card.cardImageUrl}
                        alt="Card preview"
                        className="card-form__image-preview"
                    />
                )}
            </div>

            {/* Overlay Image */}
            <div className="card-form__group">
                <label>Card Overlay:</label>
                <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'overlayImageUrl')}
                />
                {card.overlayImageUrl && (
                    <img
                        src={card.overlayImageUrl}
                        alt="Overlay preview"
                        className="card-form__image-preview"
                    />
                )}
            </div>
        </form>
    );
};

export default CardForm;