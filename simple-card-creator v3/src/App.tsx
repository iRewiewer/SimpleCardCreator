// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import SingleCardCreator from './pages/SingleCardCreator';
import BatchCardCreator from './pages/BatchCardCreator';
import ProjectRedirect from './components/ProjectRedirect';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Projects />} />
                <Route path="/create-project" element={<CreateProject />} />
                <Route path="/project/:projectId/single" element={<SingleCardCreator />} />
                <Route path="/project/:projectId/batch" element={<BatchCardCreator />} />
                <Route path="/project/:projectId" element={<ProjectRedirect />} />
            </Routes>
        </Router>
    );
};

export default App;
