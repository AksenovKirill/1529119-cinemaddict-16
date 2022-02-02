import FilmView from '../view/film-view.js';
import { remove, render, RenderPosition, replace } from '../utils/render.js';
import { UpdateType, UserAction } from '../const.js';

export default class FilmPresenter {
  #filmListContainer = null;
  #changeData = null;

  #filmComponent = null;
  #handleCardClick = null;

  #film = null;

  constructor(filmListContainer, changeData, handleCardClick) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#handleCardClick = handleCardClick;
  }

  init = (film) => {
    this.#film = film;

    const previous = this.#filmComponent;

    this.#filmComponent = new FilmView(film);

    this.#filmComponent.setCardClickHandler(() => {
      this.#handleCardClick(this.#film);
    });

    this.#filmComponent.setIsFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmComponent.setIsWatchedClickHandler(this.#handleWatchedClick);
    this.#filmComponent.setIsWatchListClickHandler(this.#handleWatchListClick);

    if (previous === null) {
      render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filmComponent, previous);
    remove(previous);
  }

  destroy = () => {
    remove(this.#filmComponent);
  }

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.PATCH,
      {...this.#film, isFavorite: !this.#film.isFavorite});
  }

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.PATCH,
      {...this.#film, isHistory: !this.#film.isHistory});
  }

  #handleWatchListClick = () => {
    this.#changeData(
      UserAction.UPDATE,
      UpdateType.PATCH,
      {...this.#film, isWatchList: !this.#film.isWatchList});
  }
}
