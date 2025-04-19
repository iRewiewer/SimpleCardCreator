import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/projects.css';

interface Project {
    id: number;
    name: string;
    description: string;
}

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
            setProjects(JSON.parse(storedProjects));
        }
    }, []);

    return (
        <div style={{ padding: '1rem' }}>
            <h1>SimpleCardCreator</h1>
            <div className="projects-grid">
                <Link to="/create-project" className="new-project-card">
                    <div>
                        <h3>New Project</h3>
                        <p>Create a new project</p>
                    </div>
                </Link>
                {projects.map((project) => (
                    <Link
                        to={`/project/${project.id}`}
                        key={project.id}
                        className="project-card"
                    >
                        <div>
                            <h3>{project.name}</h3>
                            <p>{project.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Projects;
