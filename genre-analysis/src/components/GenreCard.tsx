import React from 'react';
import { Link } from 'react-router-dom';

export interface Genre {
  GenreID: number;
  GenreName: string;
  GenreKeywords: string;
  GenreImageURL: string;
}

interface GenreCardProps {
  genre: Genre;
  onAddToCart?: () => void;
  showAddButton?: boolean;
}

const GenreCard: React.FC<GenreCardProps> = ({ genre, onAddToCart, showAddButton = false }) => {
  return (
    <div className="card-wrapper">
      <div className="card">
        <div className="card-image">
          <img src={genre.GenreImageURL || '/src/img/Default.png'} alt={genre.GenreName} />
        </div>
        <div className="card-content">
          <p className="card-title">{genre.GenreName}</p>
          <p className="card-keywords">Маркерные слова: {genre.GenreKeywords}</p>

          <Link to={`/genres/${genre.GenreID}`} className="card-details">
            Подробнее
          </Link>
          {showAddButton && onAddToCart && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('ВЫЗЫВАЕМ POST НА БЭКЕНД ДЛЯ:', genre.GenreName);
                onAddToCart();
              }}
              className="add-to-analysis-btn"
              style={{
                marginTop: '16px',
                padding: '12px',
              }}
            >
              Добавить в заявку
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenreCard;