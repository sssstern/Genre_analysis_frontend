import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header'; 

const Home: React.FC = () => {
   return (
      <div 
        className="container"
        style={{
            // 🛑 ИСПРАВЛЕНИЕ 3: Фон для всей страницы
            backgroundImage: '/src/img/Default.png', // Используем ваше изображение
            backgroundSize: 'cover', // Растягиваем на всю область
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh', // Занимаем всю высоту экрана
            width: '100%',
            margin: 0,
            padding: 0,
        }}
    >
        <Header />
      
          <main 
                className="main-content" 
                style={{
                    // 🛑 ИСПРАВЛЕНИЕ 2: Центрирование всего блока и текста
                    flexGrow: 1, // Занимаем все доступное пространство
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center', // Центрирование по вертикали
                    alignItems: 'center',     // Центрирование по горизонтали
                    textAlign: 'center', 
                    paddingTop: '0', // Убираем фиксированный отступ
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Полупрозрачный фон для читаемости текста
                }}
            >
                <h1 className="page-title" style={{color: '#990000', textShadow: '1px 1px 2px white'}}>
                    Добро пожаловать
                </h1>
                <p style={{fontSize: '24px', marginTop: '20px', color: '#000000', textShadow: '1px 1px 2px white'}}>
                    Приложение анализа принадлежности текста к жанру. Нажмите, чтобы перейти к жанрам:
                </p>
                <Link to="/genres" style={{
                    display: 'inline-block', 
                    marginTop: '30px', 
                    padding: '10px 20px', 
                    backgroundColor: '#990000', 
                    color: 'white', 
                    textDecoration: 'none', 
                    borderRadius: '5px'
                }}>
                    Перейти к списку жанров
                </Link>
          </main>
          
          {/* 🛑 ИСПРАВЛЕНИЕ 1: Футер удален */}
    </div>
  );
};

export default Home;