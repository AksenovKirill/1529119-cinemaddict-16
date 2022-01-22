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

    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmComponent.setWatchListClickHandler(this.#handleWatchListClick);

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
      UserAction.ADD_TO_FAVORITE,
      UpdateType.MINOR,
      {...this.#film, isFavorite: !this.#film.isFavorite});
  }

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.ADD_TO_HISTORY,
      UpdateType.MINOR,
      {...this.#film, isHistory: !this.#film.isHistory});
  }

  #handleWatchListClick = () => {
    this.#changeData(
      UserAction.ADD_TO_WATCHLIST,
      UpdateType.MINOR,
      {...this.#film, isWatchList: !this.#film.isWatchList});
  }
}
