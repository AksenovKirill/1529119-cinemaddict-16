import FilmExtraCardView from '../view/film-extra-view.js';
import { render, RenderPosition } from '../render.js';

export default class FilmsExtraPresenter {
  #filmListContainer = null;

  #topFilmComponent = null;

  #film = null;

  constructor(filmListContainer) {
    this.#filmListContainer = filmListContainer;
  }

  init = (film) => {
    this.#film = film;

    this.#topFilmComponent = new FilmExtraCardView(film);

    this.#topFilmComponent.setFavoriteClickHandler(this.#handleSetFavorite);
    this.#topFilmComponent.setWatchedClickHandler(this.#handleSetWatched);
    this.#topFilmComponent.setWatchListClickHandler(this.#handleSetWatchList);

    render(this.#filmListContainer, this.#topFilmComponent, RenderPosition.BEFOREEND);
  }

  #handleSetFavorite = () => {
    this.changeData({...this.#film, isFavorite: !this.#film.isFavorite});
  };

  #handleSetWatched = () => {
    this.changeData({ ...this.#film, isHistory: !this.#film.isHistory });
  };

  #handleSetWatchList = () => {
    this.changeData({ ...this.#film, isWatchList: !this.#film.isWatchList });
  };


}
