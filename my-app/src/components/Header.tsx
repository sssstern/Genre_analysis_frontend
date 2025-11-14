/*import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
    <header>
        <Link to="/"><img src="/src/img/Home.png" alt="home" /></Link>
    </header>
);

export default Header;*/

import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
        <header >
            <Link to="/"><img src="/Genre_analysis_frontend/img/Home.png" alt="home" /></Link>
            <nav className="header-nav">
                <Link to="/genres" className="nav-link">
                    Список жанров
                </Link>
            </nav>
        </header>
);

export default Header;