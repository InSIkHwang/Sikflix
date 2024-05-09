const API_KEY = "18677a1d14d2466ba897409a143c3701";
const BASE_PATH = "https://api.themoviedb.org/3/";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  original_language: string;
  release_date: string;
  vote_average: number;
}

export interface IMovieDetail {
  id: number;
  title: string;
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

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getPopularMovies() {
  return fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getTopMovies() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getMovieDetail(id: number) {
  return fetch(`${BASE_PATH}/movie/${id}?api_key=${API_KEY}&language=ko&`).then(
    (response) => {
      return response.json();
    }
  );
}

export function getMovieCredit(id: number) {
  return fetch(
    `${BASE_PATH}/movie/${id}/credits?api_key=${API_KEY}&language=ko&`
  ).then((response) => {
    return response.json();
  });
}
