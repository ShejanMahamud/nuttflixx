import { type MediaItem, type Movie, type TVShow } from "./tmdb";

// Demo data used when TMDB API key is not configured
// Uses real TMDB image paths that work with the image proxy

export const FEATURED_ITEMS: MediaItem[] = [
  {
    id: 912649, title: "Venom: The Last Dance", overview: "Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision that will bring the curtains down on Venom and Eddie's last dance.",
    poster_path: "/aosm8NMQ3UyoBVpSxyimorCQykC.jpg", backdrop_path: "/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg",
    release_date: "2024-10-22", vote_average: 6.7, vote_count: 3200, genre_ids: [878, 28, 12], popularity: 4500, original_language: "en", adult: false, media_type: "movie",
  },
  {
    id: 1184918, title: "The Wild Robot", overview: "After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island. To survive the harsh environment, Roz bonds with the island's animals and cares for an orphaned baby goose.",
    poster_path: "/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg", backdrop_path: "/4zlOPT9CrtIzs0f9bAj7H9lHIAr.jpg",
    release_date: "2024-09-12", vote_average: 8.4, vote_count: 4100, genre_ids: [16, 878, 10751], popularity: 3200, original_language: "en", adult: false, media_type: "movie",
  },
  {
    id: 94997, name: "House of the Dragon", overview: "The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke. Most combatants combatants combatants of ancient combatants are combatants.",
    poster_path: "/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg", backdrop_path: "/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg",
    first_air_date: "2022-08-21", vote_average: 8.4, vote_count: 4800, genre_ids: [10765, 18, 10759], popularity: 3800, original_language: "en", media_type: "tv",
  },
  {
    id: 1022789, title: "Inside Out 2", overview: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust are forced to share space.",
    poster_path: "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg", backdrop_path: "/xg27NrXi7VXCGUr7MN75UqLl6Vg.jpg",
    release_date: "2024-06-11", vote_average: 7.6, vote_count: 5000, genre_ids: [16, 10751, 12, 35], popularity: 5200, original_language: "en", adult: false, media_type: "movie",
  },
];

export const POPULAR_MOVIES: Movie[] = [
  { id: 912649, title: "Venom: The Last Dance", overview: "", poster_path: "/aosm8NMQ3UyoBVpSxyimorCQykC.jpg", backdrop_path: "/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg", release_date: "2024-10-22", vote_average: 6.7, vote_count: 3200, genre_ids: [878, 28, 12], popularity: 4500, original_language: "en", adult: false },
  { id: 1022789, title: "Inside Out 2", overview: "", poster_path: "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg", backdrop_path: "/xg27NrXi7VXCGUr7MN75UqLl6Vg.jpg", release_date: "2024-06-11", vote_average: 7.6, vote_count: 5000, genre_ids: [16, 10751], popularity: 5200, original_language: "en", adult: false },
  { id: 1184918, title: "The Wild Robot", overview: "", poster_path: "/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg", backdrop_path: "/4zlOPT9CrtIzs0f9bAj7H9lHIAr.jpg", release_date: "2024-09-12", vote_average: 8.4, vote_count: 4100, genre_ids: [16, 878], popularity: 3200, original_language: "en", adult: false },
  { id: 533535, title: "Deadpool & Wolverine", overview: "", poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", backdrop_path: "/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg", release_date: "2024-07-24", vote_average: 7.7, vote_count: 6000, genre_ids: [28, 35, 878], popularity: 4800, original_language: "en", adult: false },
  { id: 693134, title: "Dune: Part Two", overview: "", poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", release_date: "2024-02-27", vote_average: 8.2, vote_count: 7200, genre_ids: [878, 12], popularity: 4200, original_language: "en", adult: false },
  { id: 823464, title: "Godzilla x Kong", overview: "", poster_path: "/z1p34vh7dEOnLDV4jC1kCgGKLqk.jpg", backdrop_path: "/veIyxxi5Gs8gvztLEW1Ysb8rrzs.jpg", release_date: "2024-03-27", vote_average: 7.1, vote_count: 4300, genre_ids: [28, 878, 12], popularity: 3900, original_language: "en", adult: false },
  { id: 1011985, title: "Kung Fu Panda 4", overview: "", poster_path: "/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg", backdrop_path: "/57JnhEqfVcEHuXQCSWTAJiEbCTx.jpg", release_date: "2024-03-02", vote_average: 7.1, vote_count: 3800, genre_ids: [16, 28, 35], popularity: 3500, original_language: "en", adult: false },
  { id: 786892, title: "Furiosa", overview: "", poster_path: "/iADOJ8Zymht2JPMoy3R7xceZprc.jpg", backdrop_path: "/wNAhuOZ3Zf84jCIlrcI6JhgmY5q.jpg", release_date: "2024-05-22", vote_average: 7.6, vote_count: 3600, genre_ids: [28, 12, 878], popularity: 3100, original_language: "en", adult: false },
];

export const TOP_RATED_MOVIES: Movie[] = [
  { id: 278, title: "The Shawshank Redemption", overview: "", poster_path: "/9cjIGRSQL56sLMnNM3hUgVTezEh.jpg", backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg", release_date: "1994-09-23", vote_average: 8.7, vote_count: 26000, genre_ids: [18, 80], popularity: 4100, original_language: "en", adult: false },
  { id: 238, title: "The Godfather", overview: "", poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg", release_date: "1972-03-14", vote_average: 8.7, vote_count: 20000, genre_ids: [18, 80], popularity: 3800, original_language: "en", adult: false },
  { id: 424, title: "Schindler's List", overview: "", poster_path: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", backdrop_path: "/loRmRzQXZaz0VjHEbsIsnNGKvHa.jpg", release_date: "1993-12-15", vote_average: 8.6, vote_count: 15000, genre_ids: [18, 36, 10752], popularity: 3200, original_language: "en", adult: false },
  { id: 240, title: "The Godfather Part II", overview: "", poster_path: "/hek3kKKCGMST2cRoXBpWs0lQeN4.jpg", backdrop_path: "/kGzFbGhp99zva6oZODW5atUtnqi.jpg", release_date: "1974-12-20", vote_average: 8.6, vote_count: 12000, genre_ids: [18, 80], popularity: 2900, original_language: "en", adult: false },
  { id: 389, title: "12 Angry Men", overview: "", poster_path: "/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg", backdrop_path: "/qqHQsStV6exghCM7zbObuYBiYxw.jpg", release_date: "1957-04-10", vote_average: 8.5, vote_count: 8500, genre_ids: [18], popularity: 2600, original_language: "en", adult: false },
  { id: 129, title: "Spirited Away", overview: "", poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", backdrop_path: "/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg", release_date: "2001-07-20", vote_average: 8.5, vote_count: 16000, genre_ids: [16, 10751, 14], popularity: 3500, original_language: "ja", adult: false },
];

export const POPULAR_TV: TVShow[] = [
  { id: 94997, name: "House of the Dragon", overview: "", poster_path: "/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg", backdrop_path: "/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg", first_air_date: "2022-08-21", vote_average: 8.4, vote_count: 4800, genre_ids: [10765, 18], popularity: 3800, original_language: "en", media_type: "tv" },
  { id: 1396, name: "Breaking Bad", overview: "", poster_path: "/ztkUQFLlC19CCMYHW73FFK0RVji.jpg", backdrop_path: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg", first_air_date: "2008-01-20", vote_average: 8.9, vote_count: 14000, genre_ids: [18, 80], popularity: 4200, original_language: "en", media_type: "tv" },
  { id: 1399, name: "Game of Thrones", overview: "", poster_path: "/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg", backdrop_path: "/zZqpAXxVSBtGV9iR1s93GtLHBgp.jpg", first_air_date: "2011-04-17", vote_average: 8.4, vote_count: 22000, genre_ids: [10765, 18, 10759], popularity: 4500, original_language: "en", media_type: "tv" },
  { id: 76479, name: "The Boys", overview: "", poster_path: "/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg", backdrop_path: "/7cqKGQMnNabzOpi7qaIgZvQ7NGV.jpg", first_air_date: "2019-07-26", vote_average: 8.5, vote_count: 9800, genre_ids: [10765, 10759], popularity: 3600, original_language: "en", media_type: "tv" },
  { id: 100088, name: "The Last of Us", overview: "", poster_path: "/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg", backdrop_path: "/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg", first_air_date: "2023-01-15", vote_average: 8.8, vote_count: 6200, genre_ids: [18, 10765], popularity: 3900, original_language: "en", media_type: "tv" },
  { id: 84958, name: "Loki", overview: "", poster_path: "/voHUmluYmKyleFkTu3lOXQG702u.jpg", backdrop_path: "/q3jHCb4dMfYF6ojAbpPtKG9J5CR.jpg", first_air_date: "2021-06-09", vote_average: 8.2, vote_count: 11000, genre_ids: [10765, 18, 10759], popularity: 3400, original_language: "en", media_type: "tv" },
];

export const NOW_PLAYING: Movie[] = POPULAR_MOVIES.slice(0, 6);
export const UPCOMING_MOVIES: Movie[] = [...POPULAR_MOVIES].reverse().slice(0, 6);

export function useMockData() {
  return { featured: FEATURED_ITEMS, popularMovies: POPULAR_MOVIES, topRated: TOP_RATED_MOVIES, popularTV: POPULAR_TV, nowPlaying: NOW_PLAYING, upcoming: UPCOMING_MOVIES };
}
