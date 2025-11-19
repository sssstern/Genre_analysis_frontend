import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { type Genre } from '../components/GenreCard';
import CartIcon from '../components/CartIcon';
import Header from '../components/Header';
import { mockGenres } from '../mockData';
//import { refreshStatus } from '../store/cartStore';

//const API_BASE_URL = '/api/v1/genres/';
//const ADD_TO_ANALYSIS_URL = 'http://192.168.1.48:8082/api/v1/analysis/add-genre';

const API_BASE_URL = 'https://172.20.10.7:8443/api/v1/genres/';

const GenreDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [genre, setGenre] = useState<Genre | null>(null);
  const [loading, setLoading] = useState(true);

  //const mockGenre = mockGenres[0] || null;

  useEffect(() => {
    if (!id) return;
  
    setLoading(true);
  
    fetch(`${API_BASE_URL}${id}`)
      .then(res => {
        if (!res.ok) {
          // Ищем в mock по ID
          const fallback = mockGenres.find(g => g.GenreID === Number(id)) || mockGenres[0] || null;
          setGenre(fallback);
          throw new Error();
        }
        return res.json();
      })
      .then(data => {
        const genreData = data.data || data;
        if (genreData && genreData.GenreID) {
          setGenre(genreData as Genre);
        } else {
          const fallback = mockGenres.find(g => g.GenreID === Number(id)) || mockGenres[0] || null;
          setGenre(fallback);
        }
      })
      .catch(() => {
        const fallback = mockGenres.find(g => g.GenreID === Number(id)) || mockGenres[0] || null;
        setGenre(fallback);
      })
      .finally(() => setLoading(false));
  }, [id]);

  /*const handleAddToAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genre) return;

    const formData = new URLSearchParams();
    formData.append('genre_id', genre.GenreID.toString());
    formData.append('comment_to_request', '');
    formData.append('probability', '0');

    try {
      const response = await fetch(ADD_TO_ANALYSIS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
        credentials: 'include',
      });

      if (response.ok) {
        refreshStatus();               
      }
    } catch {
        //
    }
  };*/

  if (loading) return <div>Загрузка деталей услуги...</div>;
  if (!genre) return <div style={{ color: 'red' }}>Услуга не найдена.</div>;

  return (
    <div className="container">
      <Header />
      <CartIcon />
      <div className="genre-adress">
        <Link to="/" className="adress-text" style={{ textDecoration: 'none' }}>
          Главная/
        </Link>
        <Link to="/genres" className="adress-text">
          Услуги/
        </Link>
        <span className="adress-text" style={{ textDecoration: 'none', color: '#000000' }}>
          {genre.GenreName}
        </span>
      </div>

      <main className="genre-main">
        <div className="genre-content">
          <div className="genre-info">
            <h2 className="genre-subtitle">{genre.GenreName}</h2>
            <div className="keywords-section">
              <p className="card-keywords" style={{ fontSize: '16px', lineHeight: '1.4' }}>
                Маркерные слова: {genre.GenreKeywords || 'Нет данных'}
              </p>
            </div>
          </div>

          <div className="genre-image">
            <img src={genre.GenreImageURL || '/img/Default.png'} alt={genre.GenreName} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default GenreDetails;