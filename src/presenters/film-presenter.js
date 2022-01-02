import FilmCardView from '../view/movie-card-view.js';
import PopupView from '../view/popup-view.js';
import {remove,render,RenderPosition,replace} from '../render.js';

const bodyElement = document.querySelector('body');
const siteFooter = document.querySelector('.footer');

export default class FilmPresenter {
  #filmListContainer = null;
  changeData = null;

  #filmCardComponent = null;
  #popupComponent = null;

  #film = null;

  constructor(filmListContainer, changeData) {
    this.#filmListContainer = filmListContainer;
    this.changeData = changeData;
  }

  init = (film) => {
    this.#film = film;

    const previousFilmComponent = this.#filmCardComponent;
    const previousPopupComponent = this.#popupComponent;

    this.#filmCardComponent = new FilmCardView(film);
    this.#popupComponent = new PopupView(film);

    this.#filmCardComponent.setCardClickHandler(() => {
      render(siteFooter, this.#popupComponent, RenderPosition.AFTEREND);

      this.#handleCardClick();
    });

    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCardComponent.setWatchListClickHandler(this.#handleWatchListClick);

    this.#popupComponent.setClosePopupButtonClickHandler(this.#closePopup);

    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupComponent.setWatchListClickHandler(this.#handleWatchListClick);

    if (previousFilmComponent === null || previousPopupComponent === null) {
      render(this.#filmListContainer, this.#filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#filmListContainer.element.contains(previousPopupComponent.element)) {
      replace(this.#popupComponent, previousPopupComponent);
    }

    remove(previousFilmComponent);
    remove(previousPopupComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#popupComponent);
  };

  #handleCardClick = () => {
    bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#handleEscKeyDown);
  };

  #closePopup = () => {
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#handleEscKeyDown);
    remove(this.#popupComponent);
    this.#popupComponent = null;
  };

  #handleEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopup();
    }
  };

  #handleFavoriteClick = () => {
    this.changeData({...this.#film, isFavorite: !this.#film.isFavorite});
  };

  #handleWatchedClick = () => {
    this.changeData({ ...this.#film, isHistory: !this.#film.isHistory });
  };

  #handleWatchListClick = () => {
    this.changeData({ ...this.#film, isWatchList: !this.#film.isWatchList });
  };
}
