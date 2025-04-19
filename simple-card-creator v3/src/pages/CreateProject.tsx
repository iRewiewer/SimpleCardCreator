// src/pages/CreateProject.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Project {
    id: number;
    name: string;
    description: string;
}

const CreateProject: React.FC = () => {
    const [project, setProject] = useState<{ name: string; description: string }>({ name: '', description: '' });
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProject(prev => ({ ...prev, [name]: value }));
    };

    const createProject = () => {
        if (project.name.trim() === '') return; // basic validation

        const newProject: Project = {
            id: Date.now(), // simple unique id
            name: project.name,
            description: project.description,
        };

        // Retrieve existing projects from localStorage
        const storedProjects = localStorage.getItem('projects');
        let projects: Project[] = storedProjects ? JSON.parse(storedProjects) : [];
        projects.push(newProject);
        localStorage.setItem('projects', JSON.stringify(projects));

        // Navigate back to the projects page
        navigate('/');
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Create New Project</h2>
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="name">Project Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={project.name}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
                />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="description">Project Description:</label>
                <textarea
                    id="description"
                    name="description"
                    value={project.description}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
                ></textarea>
            </div>
            <button onClick={createProject} style={{ padding: '0.5rem 1rem' }}>Create</button>
        </div>
    );
};

export default CreateProject;
