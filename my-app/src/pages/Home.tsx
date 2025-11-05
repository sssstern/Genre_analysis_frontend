import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header'; 

const Home: React.FC = () => {
   return (
      <div 
        className="container"
        style={{
            backgroundImage: '/src/img/Default.png', 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh', 
            width: '100%',
            margin: 0,
            padding: 0,
        }}
    >
         <Header />
    <main 
                className="main-content" 
                style={{
                    
                    flexGrow: 1, 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center',    
                    textAlign: 'center', 
                    paddingTop: '0',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
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
                    sПерейти к списку жанров
                 </Link>
            </main>
    </div>
     );
};

export default Home;