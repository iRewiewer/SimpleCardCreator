import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SingleCardCreator from './pages/SingleCardCreator';
import BatchCardCreator from './pages/BatchCardCreator';

const App: React.FC = () => (
    <BrowserRouter basename="/SimpleCardCreator">
        <Navbar />
        <Routes>
            <Route path="/single" element={<SingleCardCreator />} />
            <Route path="/batch" element={<BatchCardCreator />} />
            <Route path="*" element={<Navigate to="/single" replace />} />
        </Routes>
    </BrowserRouter>
);

export default App;
