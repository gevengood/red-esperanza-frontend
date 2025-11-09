import React from 'react';
import './Header.css';

const Header = ({ title, subtitle, showBack = false, onBack }) => {
  return (
    <header className="header">
      <div className="header-content">
        {showBack && (
          <button className="back-button" onClick={onBack}>
            ← 
          </button>
        )}
        <div className="header-text">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
};

export default Header;
