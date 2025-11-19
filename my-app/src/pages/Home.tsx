import React from 'react';
import Header from '../components/Header';

const Home: React.FC = () => {
   return (
      <div
        className="container"
        style={{
            backgroundImage: 'url(/src/img/back.jpg)',
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
                padding: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                maxWidth: '800px',
                margin: '0 auto',
            }}
         >
            <h1 className="page-title" style={{color: '#990000'}}>
               Определение жанра текста по лексическим маркерам
            </h1>
            <p style={{
                fontSize: '18px',
                marginTop: '20px',
                color: 'rgba(0, 0, 0)',
                lineHeight: '1.6'
            }}>
               Cервис помогает определить жанровую принадлежность текста на основе анализа лексических маркеров.
               Каждый жанр имеет свой уникальный набор ключевых слов, которые служат маркерами для точного определения.
               Вы можете отправить заявку на анализ текста, и мы рассчитаем вероятностную принадлежность вашего текста к тому или иному жанру,
               основываясь на частотности использования ключевых маркерных слов.
            </p>
         </main>
      </div>
   );
};

export default Home;
