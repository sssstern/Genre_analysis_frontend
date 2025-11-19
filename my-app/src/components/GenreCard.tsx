import React from 'react';
import { Link } from 'react-router-dom';
import useAnalysisRequest from '../hooks/useAnalysisRequest'; 

export interface Genre {
  GenreID: number;
  GenreName: string;
  GenreKeywords: string;
  GenreImageURL: string;
}

const GenreCard: React.FC<{ genre: Genre }> = ({ genre }) => {
  const { refreshStatus } = useAnalysisRequest(); 
  
  const handleAddToRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_ADD_URL = `/api/v1/genres/add-to-analysis/${genre.GenreID}`; 
    
    try {
        const response = await fetch(API_ADD_URL, {
            method: 'POST',
        });

        if (response.ok) {
            alert(`Услуга "${genre.GenreName}" успешно добавлена в заявку!`);
            refreshStatus(); 
        } else {
            const errorText = await response.text();
            throw new Error(`Ошибка добавления в заявку. Статус: ${response.status}. Ответ: ${errorText.substring(0, 50)}...`);
        }
    } catch (error) {
        if (error instanceof Error) {
            alert(`Ошибка при добавлении в заявку: ${error.message}`);
        } else {
            alert("Произошла неизвестная ошибка при добавлении в заявку.");
        }
    }
  };

  return (
    <div className="card-wrapper">
      <div className="card"> 
        <div className="card-image">
          <img 
            src={genre.GenreImageURL || '/src/img/Default.png'} 
            alt={genre.GenreName}
          />
        </div>
        <div className="card-content">
          <p className="card-title">{genre.GenreName}</p>
          <p className="card-keywords">Маркерные слова: {genre.GenreKeywords}</p>
          
          <Link to={`/genres/${genre.GenreID}`} className="card-details">
            Подробнее
          </Link>
          
          {/* 
          <form className="add-to-analysis-form" onSubmit={handleAddToRequest}>
            <input type="hidden" name="genre_id" value={genre.GenreID} />
            <button type="submit" className="add-to-analysis-btn">
              Добавить в заявку
            </button>
          </form>
           */}
        </div>
      </div>
    </div>
  );
};

export default GenreCard;