import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
    <header>
        <Link to="/"><img src="/src/img/Home.png" alt="home" /></Link>
    </header>
);

export default Header;