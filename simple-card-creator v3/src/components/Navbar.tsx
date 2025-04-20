// src/components/Navbar.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import { IconBaseProps } from 'react-icons';
import '../styles/navbar.css';

// cast so TS knows these return JSX.Element
const SunIcon = FiSun as React.ComponentType<IconBaseProps>;
const MoonIcon = FiMoon as React.ComponentType<IconBaseProps>;

// how much bigger: 1.5 = 150%, 2 = 200%…
const ICON_SCALE = 2.25;

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [theme, setTheme] = useState<'light' | 'dark'>(() =>
        localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
    );

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () =>
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

    return (
        <nav className="navbar">
            <div className="navbar__brand">SimpleCardCreator</div>
            <div className="navbar__actions">
                <button
                    className="btn navbar__theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    {theme === 'light'
                        ? <MoonIcon
                            style={{
                                transform: `scale(${ICON_SCALE})`,
                                transformOrigin: 'center',
                            }}
                        />
                        : <SunIcon
                            style={{
                                transform: `scale(${ICON_SCALE})`,
                                transformOrigin: 'center',
                            }}
                        />}
                </button>
                <button
                    className={`btn navbar__btn${location.pathname === '/single'
                        ? ' navbar__btn--active'
                        : ''
                        }`}
                    onClick={() => navigate('/single')}
                >
                    Single Mode
                </button>
                <button
                    className={`btn navbar__btn${location.pathname === '/batch'
                        ? ' navbar__btn--active'
                        : ''
                        }`}
                    onClick={() => navigate('/batch')}
                >
                    Batch Mode
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
