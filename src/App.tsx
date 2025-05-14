import React from 'react';
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import SingleCardCreator from './pages/SingleCardCreator';
import BatchCardCreator from './pages/BatchCardCreator';

const App: React.FC = () => (
    <HashRouter basename="/SimpleCardCreator">
        <Navbar />
        <Routes>
            <Route path="/single" element={<SingleCardCreator />} />
            <Route path="/batch" element={<BatchCardCreator />} />
            <Route path="*" element={<Navigate to="/single" replace />} />
        </Routes>
    </HashRouter>
);

export default App;
