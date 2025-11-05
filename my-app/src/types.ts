// 💡 Тип данных для Услуги (Жанра)
export interface Genre {
    GenreID: number;
    GenreName: string;
    GenreKeywords: string;
    GenreImageURL: string; // Адрес из Minio
  }
  
  // 💡 Тип данных для полей фильтрации
  export interface GenreFilters {
    name: string;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    startDate: string;
    endDate: string;
  }



export interface AnalysisRequestData {
    AnalysisRequestID: number;
    TextToAnalyse: string;
    // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Используем ключ с бэкенда
    //GenresInRequest: GenreInRequest[]; 
}

export interface FlatGenreItem {
  GenreID: number;
  GenreName: string;
  GenreKeywords: string;
  GenreImageURL?: string; 
  ProbabilityPercent: number | string; 
  CommentToRequest: string; 
}

// Интерфейс для полных данных заявки
export interface AnalysisRequestData {
  AnalysisRequestID: number;
  TextToAnalyse: string;
  AnalysisRequestStatus: string;
  CreatedAt: string;
  CreatorLogin: string;
  
  // 🛑 ИСПРАВЛЕНО: Меняем GenresInRequest на Genres, 
  // чтобы соответствовать ответу сервера (Genres: Array(6))
  Genres: FlatGenreItem[]; 
  
  // Удаляем устаревший GenresInRequest, если он был
  // GenresInRequest: GenreInRequest[]; // УДАЛИТЬ ИЛИ ЗАКОММЕНТИРОВАТЬ
}