import FilmView from '../view/film-view.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { UpdateType, UserAction } from '../const.js';

export default class FilmPresenter {
  #filmListContainer = null;
  #changeData = null;

  #filmCardComponent = null;
  #handleCardClick = null;

  #film = null;

  constructor(filmListContainer, changeData, handleCardClick) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#handleCardClick = handleCardClick;
  }

  init = (film) => {
    this.#film = film;

    const previous = this.#filmCardComponent;

    this.#filmCardComponent = new FilmView(film);

    this.#filmCardComponent.setCardClickHandler(() => {
      this.#handleCardClick(this.#film);
    });

    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCardComponent.setWatchListClickHandler(this.#handleWatchListClick);

    if (previous === null) {
      render(this.#filmListContainer, this.#filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    remove(previous);
  }

  destroy = () => {
    remove(this.#filmCardComponent);
  }

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.ADD_TO_FAVORITE,
      UpdateType.MINOR,
      {...this.#film, isFavorite: this.#film.isFavorite});
  }

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.ADD_TO_HISTORY,
      UpdateType.MINOR,
      {...this.#film, isHistory: this.#film.isHistory});
  }

  #handleWatchListClick = () => {
    this.#changeData(
      UserAction.ADD_TO_WATCHLIST,
      UpdateType.MINOR,
      {...this.#film, isWatchList: this.#film.isWatchList});
  };
}
