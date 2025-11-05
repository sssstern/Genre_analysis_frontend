import type { Genre, GenreFilters } from '../types';
import { mockGenres } from '../mockData';

const API_BASE_URL = '/api/v1/genres'; // Используем прокси
const MOCK_FALLBACK_DELAY = 500; // Задержка для имитации загрузки mock

// 💡 Вызовы fetch: Функция для получения списка услуг с фильтрацией
export async function fetchGenres(filters: GenreFilters): Promise<Genre[]> {
  // Формирование URL с параметрами фильтрации для бэкенда
  const params = new URLSearchParams();
  if (filters.name) params.append('name', filters.name);

  const url = `${API_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Бэкенд недоступен (HTTP ${response.status}).`);
    }
    
    // 💡 Показать в Network: Адрес fetch будет /api/genres?...
    return await response.json();
    
  } catch (err: any) {
    console.error("Ошибка API. Переход на mock:", err.message);
    
    // 💡 Получение данных из коллекции с mock-объектами при отсутствии доступа к бэкенду
    await new Promise(resolve => setTimeout(resolve, MOCK_FALLBACK_DELAY)); // Имитация задержки
    
    // Фильтрация mock-данных на фронте (для имитации работы фильтров)
    return mockGenres.filter(g => 
        g.GenreName.toLowerCase().includes(filters.name.toLowerCase()) 
    );
  }
}

// 💡 Функция для получения деталей услуги
export async function fetchGenreDetails(id: number): Promise<Genre | null> {
    try {
        const response = await fetch(`/api/v1/genres/${id}`);
        if (!response.ok) throw new Error(`Бэкенд недоступен.`);
        return await response.json();
    } catch {
        // Mock-логика для деталей
        await new Promise(resolve => setTimeout(resolve, MOCK_FALLBACK_DELAY));
        return mockGenres.find(g => g.GenreID === id) || null;
    }
}