const API_KEY = "18677a1d14d2466ba897409a143c3701";
const BASE_PATH = "https://api.themoviedb.org/3/";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  name: string;
  overview: string;
  original_language: string;
  release_date: string;
  vote_average: number;
  first_air_date: string;
}

export interface IMovieDetail {
  id: number;
  name: string;
  title: string;
  overview: string;
  backdrop_path: string;
  original_language: string;
  release_date: string;
  vote_average: number;
  first_air_date: string;
  poster_path: string;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  production_companies: [{ logo_path: string; name: string }];
}

export interface IMovieCredit {
  id: number;
  cast: [
    {
      id: number;
      name: string;
      profile_path: string;
    }
  ];
  crew: [{ id: number; name: string; job: string; profile_path: string }];
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface ISearchResult {
  id: number;
  name?: string;
  title?: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  original_title: string;
  release_date?: string; // 영화
  first_air_date?: string; // 시리즈
}

export interface IGetSearch {
  page: number;
  results: ISearchResult[];
  total_pages: number;
  total_results: number;
  dates: string;
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}movie/now_playing?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getTvs() {
  return fetch(
    `${BASE_PATH}tv/on_the_air?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getPopularMovies() {
  return fetch(
    `${BASE_PATH}movie/popular?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getPopularTvs() {
  return fetch(
    `${BASE_PATH}tv/popular?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getTopMovies() {
  return fetch(
    `${BASE_PATH}movie/top_rated?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getTopTvs() {
  return fetch(
    `${BASE_PATH}tv/top_rated?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getMovieDetail(id: number) {
  return fetch(`${BASE_PATH}movie/${id}?api_key=${API_KEY}&language=ko&`).then(
    (response) => {
      return response.json();
    }
  );
}

export function getTvDetail(id: number) {
  return fetch(`${BASE_PATH}tv/${id}?api_key=${API_KEY}&language=ko&`).then(
    (response) => {
      return response.json();
    }
  );
}

export function getMovieCredit(id: number) {
  return fetch(
    `${BASE_PATH}movie/${id}/credits?api_key=${API_KEY}&language=ko&`
  ).then((response) => {
    return response.json();
  });
}

export function getTvCredit(id: number) {
  return fetch(
    `${BASE_PATH}tv/${id}/credits?api_key=${API_KEY}&language=ko&`
  ).then((response) => {
    return response.json();
  });
}

export function getSearchMovie(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1`
  ).then((response) => {
    return response.json();
  });
}

export function getSearchTv(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`
  ).then((response) => {
    return response.json();
  });
}
