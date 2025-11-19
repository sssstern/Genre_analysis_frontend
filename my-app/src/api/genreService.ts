import type { Genre, GenreFilters } from '../types';
import { mockGenres } from '../mockData';

const API_BASE_URL = '/api/v1/genres'; 
const MOCK_FALLBACK_DELAY = 500; 

export async function fetchGenres(filters: GenreFilters): Promise<Genre[]> {
  const params = new URLSearchParams();
  if (filters.name) params.append('name', filters.name);

  const url = `${API_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Бэкенд недоступен (HTTP ${response.status}).`);
    }
    
    return await response.json();
    
  } catch (err: any) {
    console.error("Ошибка API. Переход на mock:", err.message);
    

    await new Promise(resolve => setTimeout(resolve, MOCK_FALLBACK_DELAY)); 

    return mockGenres.filter(g => 
        g.GenreName.toLowerCase().includes(filters.name.toLowerCase()) 
    );
  }
}

export async function fetchGenreDetails(id: number): Promise<Genre | null> {
    try {
        const response = await fetch(`/api/v1/genres/${id}`);
        if (!response.ok) throw new Error(`Бэкенд недоступен.`);
        return await response.json();
    } catch {

        await new Promise(resolve => setTimeout(resolve, MOCK_FALLBACK_DELAY));
        return mockGenres.find(g => g.GenreID === id) || null;
    }
}