import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
    <header>
        {/* Переход на страницу списка жанров */}
        <Link to="/"><img src="/src/img/Home.png" alt="home" /></Link>
    </header>
);

export default Header;