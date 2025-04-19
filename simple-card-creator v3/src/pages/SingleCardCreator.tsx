// src/pages/SingleCardCreator.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CardForm from '../components/CardForm';
import CardPreview from '../components/CardPreview';
import { Card, Project } from '../types';

const SingleCardCreator: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [card, setCard] = useState<Card>({
        id: 0,
        name: '',
        description: '',
        artworkName: '',
        overlay: '',
        faction: '',
        attribute: '',
        type: 'Unit',
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
    });

    useEffect(() => {
        if (!projectId) return;
        const stored = localStorage.getItem('projects');
        if (!stored) return;
        const projects: Project[] = JSON.parse(stored);
        const found = projects.find(p => p.id.toString() === projectId);
        if (found) {
            setProject(found);
            if (found.card) setCard(found.card);
        }
    }, [projectId]);

    const updateCard = (updated: Card) => {
        setCard(updated);
        if (!project) return;
        const stored = localStorage.getItem('projects');
        if (!stored) return;
        const projects: Project[] = JSON.parse(stored).map((p: { id: number; }) =>
            p.id === project.id ? { ...p, card: updated } : p
        );
        localStorage.setItem('projects', JSON.stringify(projects));
    };

    const switchToBatchMode = () => {
        if (projectId) navigate(`/project/${projectId}/batch`);
    };

    if (!project) return <div>Loading project...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <h2>{project.name} - Card Creator</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button style={{ padding: '0.5rem 1rem' }}>Single Card Mode</button>
                <button style={{ padding: '0.5rem 1rem' }} onClick={switchToBatchMode}>Batch Mode</button>
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ flex: '1 1 40%' }}>
                    <CardPreview card={card} />
                </div>
                <div style={{ flex: '1 1 60%' }}>
                    <CardForm card={card} onChange={updateCard} />
                </div>
            </div>
        </div>
    );
};

export default SingleCardCreator;
