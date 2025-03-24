import React from 'react';
import './MainLayout.css';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="main-layout">
            <header className="header">
                <h1>Queens Solver</h1>
            </header>

            <main className="content">{children}</main>

            <footer className="footer">
                <p>Queens Solver Puzzle Game</p>
            </footer>
        </div>
    );
};

export default MainLayout;
