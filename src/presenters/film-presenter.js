import FilmCardView from '../view/movie-card-view.js';
import PopupView from '../view/popup-view.js';
import PopupCommentsView from '../view/popup-comments-view.js';
import {remove,render,RenderPosition,replace} from '../render.js';

const bodyElement = document.querySelector('body');
const siteFooter = document.querySelector('.footer');

export default class FilmPresenter {
  #filmListContainer = null;
  changeData = null;

  #filmCardComponent = null;
  #popupComponent = null;
  #popupComments = null;

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
    this.#popupComments = new PopupCommentsView(film.comments).element;

    this.#filmCardComponent.setCardClickHandler(() => {
      render(siteFooter, this.#popupComponent, RenderPosition.BEFOREEND);
      render(
        this.#popupComponent.popupCommentsTemplate,
        this.#popupComments,
        RenderPosition.BEFOREEND
      );
      this.#handleCardClick();
    });

    this.#filmCardComponent.setFavoriteClickHandler(this.#handleSetFavorite);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleSetWatched);
    this.#filmCardComponent.setWatchListClickHandler(this.#handleSetWatchList);

    this.#popupComponent.setClosePopupButtonClickHandler(this.#closePopup);

    this.#popupComponent.setFavoriteClickHandler(this.#handleSetFavorite);
    this.#popupComponent.setWatchedClickHandler(this.#handleSetWatched);
    this.#popupComponent.setWatchListClickHandler(this.#handleSetWatchList);

    if (previousFilmComponent === null || previousPopupComponent === null) {
      render(
        this.#filmListContainer,
        this.#filmCardComponent,
        RenderPosition.BEFOREEND
      );
      return;
    }

    if (this.#filmListContainer.element.contains(previousFilmComponent.element)) {
      replace(this.#filmCardComponent, previousFilmComponent);
    }

    if (
      this.#filmListContainer.element.contains(previousPopupComponent.element)
    ) {
      replace(this.#popupComponent, previousPopupComponent);
    }

    remove(previousFilmComponent);
    remove(previousPopupComponent);

    destroy = () => {
      remove(this.#filmCardComponent);
      remove(this.#popupComponent);
    };
  };

  #handleCardClick = () => {
    bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#handleEsckeyDown);
  };

  #closePopup = () => {
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#handleEsckeyDown);
    remove(this.#popupComponent);
    this.#popupComponent = null;
  };

  #handleEsckeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopup();
    }
  };

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
