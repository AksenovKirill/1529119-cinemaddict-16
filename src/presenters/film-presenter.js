import FilmCardView from '../view/movie-card-view.js';
import {remove,render,RenderPosition, replace, updateItem} from '../render.js';

const siteFooter = document.querySelector('.footer');

export default class FilmPresenter {
  #filmListContainer = null;
  changeData = null;

  #filmCardComponent = null;
  #popupComponent = null;
  #handleCardClick = null;

  #film = null;

  constructor(filmListContainer, handleCardClick) {
    this.#filmListContainer = filmListContainer;
    this.#handleCardClick = handleCardClick;
  }

  init = (film) => {
    this.#film = film;

    const previous = this.#filmCardComponent;
    const previousPopupComponent = this.#popupComponent;

    this.#filmCardComponent = new FilmCardView(film);

    this.#filmCardComponent.setCardClickHandler(() => {
      render(siteFooter, this.#popupComponent, RenderPosition.AFTEREND);
      this.#handleCardClick(this.#film);
    });

    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCardComponent.setWatchListClickHandler(this.#handleWatchListClick);

    if (previous === null) {
      render(this.#filmListContainer, this.#filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#filmListContainer.element.contains(previousPopupComponent.element)) {
      replace(this.#popupComponent, previousPopupComponent);
    }

    remove(previous);
    remove(previousPopupComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#popupComponent);
  };

  #handleFavoriteClick = (film) => {
    updateItem({...film, isFavorite: !film.isFavorite});
  };

  #handleWatchedClick = (film) => {
    updateItem({ ...film, isHistory: !film.isHistory });
  };

  #handleWatchListClick = (film) => {
    updateItem({ ...film, isWatchList: !film.isWatchList });
  };
}
