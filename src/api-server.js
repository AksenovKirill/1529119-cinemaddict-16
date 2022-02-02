import { Method } from './const.js';

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  getComments = async (filmId) => {
    const response = await this.#load({ url: `comments/${filmId}` });
    return await ApiService.parseResponse(response);
  }

  addComment = async (comment, filmId) => {
    const response = await this.#load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  deleteComment = async (commentId) => await this.#load({
    url: `comments/${commentId}`,
    method: Method.DELETE,
  })

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }

  adaptToServer(film) {
    const adaptedFilm = {...film,
      'comments': film.comments.map((comment) => comment.id ? comment.id : comment),
      'id': film.id,
      'film_info': {
        'title': film.title,
        'alternative_title': film.alternativeTitle,
        'total_rating': film.rating,
        'poster': film.poster,
        'age_rating': film.ageRating,
        'director': film.director,
        'writers': film.screenwriter,
        'actors': film.actors,
        'release': {
          'date': String(film.filmDate),
          'release_country': String(film.country),
        },
        'runtime': film.runTime,
        'genre': film.genres,
        'description': film.description,
      },
      'user_details': {
        'watchlist': film.isWatchList,
        'already_watched': film.isHistory,
        'watching_date': film.realeaseDate,
        'favorite': film.isFavorite,
      },
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;
    delete adaptedFilm.alternativeTitle;
    delete adaptedFilm.totalRating;
    delete adaptedFilm.poster;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.director;
    delete adaptedFilm.writers;
    delete adaptedFilm.actors;
    delete adaptedFilm.runtime;
    delete adaptedFilm.genre;
    delete adaptedFilm.description;
    delete adaptedFilm.isWatchlist;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.isFavorites;
    delete adaptedFilm.filmDate;
    delete adaptedFilm.releaseCountry;
    delete adaptedFilm.smile;
    delete adaptedFilm.value;
    delete adaptedFilm.newTextComment;
    delete adaptedFilm.title;

    return adaptedFilm;
  }
}
