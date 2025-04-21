import React, { ReactNode } from 'react';
import '../styles/modal.css';

interface ModalProps {
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div
            className="modal-content"
            onClick={e => {
                e.stopPropagation(); // don’t close when clicking inside
            }}
        >
            <button className="modal-close" onClick={onClose} aria-label="Close">
                ×
            </button>
            {children}
        </div>
    </div>
);

export default Modal;
