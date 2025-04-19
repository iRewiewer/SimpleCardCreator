// src/components/ProjectRedirect.tsx

import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

const ProjectRedirect: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    return <Navigate to={`/project/${projectId}/single`} replace />;
};

export default ProjectRedirect;
