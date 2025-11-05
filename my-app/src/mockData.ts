import { type Genre } from './types'; // Предполагая, что GenreCard.tsx существует

export const mockGenres: Genre[] = [
    {
        GenreID: 9001,
        GenreName: "Фэнтези",
        GenreKeywords: "магия, миры, драконы, пророчества",
        GenreImageURL: "/src/img/Default.png",
    },
    {
        GenreID: 9002,
        GenreName: "Киберпанк",
        GenreKeywords: "технологии, антиутопия, хакеры, корпорации",
        GenreImageURL: "/src/img/Default.png",
    },
    {
        GenreID: 9003,
        GenreName: "Историческая проза",
        GenreKeywords: "Средневековье, битвы, биографии, династии",
        GenreImageURL: "/src/img/Default.png",
    },
];