import React from 'react';
import Navbar from './components/Navbar';
import SingleCardCreator from './pages/SingleCardCreator';
import BatchCardCreator from './pages/BatchCardCreator';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const App: React.FC = () => (
    <Router basename={process.env.PUBLIC_URL}>
        <Navbar />
        <Routes>
            <Route path="/single" element={<SingleCardCreator />} />
            <Route path="/batch" element={<BatchCardCreator />} />
            <Route path="*" element={<Navigate to="/single" replace />} />
        </Routes>
    </Router>
);

export default App;
