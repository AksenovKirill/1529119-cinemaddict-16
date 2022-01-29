import AbstractObservable from '../utils/abstract-observable.js';
import { UpdateType } from '../const.js';

export default class FilmsModel extends AbstractObservable {
  #apiService = null;
  #films = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {

    try {
      const films = await this.#apiService.films;
      this.#films = films.map(this.#adapterToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  }

  updateFilm = async (updateType, update, comments) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update!!! unexisting film');
    }

    try {
      const response = await this.#apiService.updateFilm(update);
      const updatedFilm = this.#adapterToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        update,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updatedFilm, comments);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  }

  #adapterToClient = (film) => {
    const adaptedFilm = {...film,
      comments: film['comments'],
      title: film['film_info']['title'],
      alternativeTitle: film['film_info']['alternative_title'],
      rating: film['film_info']['total_rating'],
      poster: film['film_info']['poster'],
      ageRating: film['film_info']['age_rating'],
      director: film['film_info']['director'],
      screenwriter: film['film_info']['writers'],
      actors: film['film_info']['actors'],
      filmDate: film['film_info']['release']['date'],
      country: film['film_info']['release']['release_country'],
      runTime: film['film_info']['runtime'],
      genres: film['film_info']['genre'],
      description: film['film_info']['description'],
      isWatchList: film['user_details']['watchlist'],
      isHistory: film['user_details']['already_watched'],
      realeaseDate: film['user_details']['watching_date'],
      isFavorite: film['user_details']['favorite'],
    };
    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];
    return adaptedFilm;
  }
}
