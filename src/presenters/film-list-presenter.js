import UserRankView from '../view/user-rank-view.js';
import NoFilmCardView from '../view/no-filmcard-view.js';
import SortView from '../view/sort-cards-view.js';
import FilmListView from '../view/film-list-view.js';
import ShowMoreButtonView from '../view/showmore-view.js';
import PopupView from '../view/popup-view.js';
import FilmPresenter from '../presenters/film-presenter.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { sorters, sortFilms } from '../utils/film.js';
import { SortType } from '../const.js';

const FILM_COUNT_PER_STEP = 5;

const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const bodyElement = document.querySelector('body');
const siteFooter = document.querySelector('.footer');

export default class FilmsPresenter {
#filmListContainer = null;
#filmsModel = null;

#userRankComponent = new UserRankView();
#noFilmCardsComponent = new NoFilmCardView();
#sortButtonsCardsComponent = new SortView();
#filmListComponent = new FilmListView();
#showMoreButtonComponent = new ShowMoreButtonView();
#popupComponent = null;

#renderedFilmCount = FILM_COUNT_PER_STEP;
#filmPresenter = new Map();
#currentSortType = SortType.DEFAULT;

constructor(filmListContainer, filmsModel) {
  this.#filmListContainer = filmListContainer;
  this.#filmsModel = filmsModel;
}

get films () {
  switch (this.#currentSortType) {
    case SortType.DATE:
      return  sortFilms([...this.#filmsModel.films], SortType.DATE);
    case SortType.RATING:
      return  sortFilms([...this.#filmsModel.films], SortType.RATING);
  }
  return this.#filmsModel.films;
}

  init = () => {
    render(siteMainElement, this.#filmListComponent, RenderPosition.BEFOREEND);
    this.#renderMainPage();
  };

  #renderSort = () => {
    this.#sortButtonsCardsComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(
      this.#filmListComponent,
      this.#sortButtonsCardsComponent,
      RenderPosition.BEFOREBEGIN
    );
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearFilmList();
    this.#renderFilmList()
  }

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmListComponent.filmListContainerTemplate, this.#handleCardClick, this.films);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #handleCardClick = (film) => {
    if(this.#popupComponent !== null) {
      this.#closePopup();
    }
    this.#renderPopup(film);

  };

  #handleChangeFilm = (updateFilm) => {
    this.#filmPresenter.get(updateFilm.id).init(updateFilm);
  }

  #renderFilms = () => {
    this.films.slice(0, 5).forEach((film) => this.#renderFilm(film));
  };

  #renderPopup = (film) => {
    bodyElement.classList.add('hide-overflow');

    this.#popupComponent = new PopupView(film);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#popupComponent.setClosePopupButtonClickHandler(this.#closePopup);
    document.addEventListener('keydown', this.#handleEscKeyDown);

    render(siteFooter, this.#popupComponent, RenderPosition.AFTEREND);
  }

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

  #handleFavoriteClick = (film) => {
    updateItem({...film, isFavorite: !film.isFavorite});
  };

  #handleWatchedClick = (film) => {
    updateItem({ ...film, isHistory: !film.isHistory });
  };

  #handleWatchListClick = (film) => {
    updateItem({ ...film, isWatchList: !film.isWatchList });
  };

  #renderNoFilms = () => {
    render(siteMainElement, this.#noFilmCardsComponent, RenderPosition.BEFOREEND);
  };

  #handleShowMoreButtonClick = () => {
    this.films.slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((card) => this.#renderFilm(card));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.films.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderShowMoreButton = () => {
    render(this.#filmListComponent.filmListTemplate,this.#showMoreButtonComponent,RenderPosition.BEFOREEND);
    this.#showMoreButtonComponent.setEditClickHandler(
      this.#handleShowMoreButtonClick
    );
  };

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
  };

  #renderUserRank = () => {
    render(siteHeader, this.#userRankComponent, RenderPosition.BEFOREEND);

    if (this.films.length === 0) {
      this.#filmListComponent.element.innerHTML = '';
      this.#sortButtonsCardsComponent.element.innerHTML = '';
      this.#renderNoFilms();
    }
  };

  #renderTopRatedFilm = () => {
    const topRatedFilmsPresenter = new FilmPresenter(this.#filmListComponent.filmListTopRatedTemplate, this.#handleCardClick);
    topRatedFilmsPresenter.init();
  };

  #renderTopRatedFilms = () => {
    this.films.sort(sorters.rating).slice(0, 2).forEach((film) => this.#renderTopRatedFilm(film));
  };

  #renderMostCommentedFilm = () => {
    const mostCommentedFilmsPresenter = new FilmPresenter(this.#filmListComponent.filmListMostCommentedTemplate, this.#handleCardClick);
    mostCommentedFilmsPresenter.init();
  };

  #renderMostCommentedFilms = () => {
    this.films.sort(sorters.comments).slice(0,2).forEach((film) => this.#renderMostCommentedFilm(film));
  };

  #renderFilmList = () => {
    this.#renderFilms(0, Math.min(this.films.length, FILM_COUNT_PER_STEP));

    if (this.films > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderMainPage = () => {
    this.#renderUserRank();

    this.#clearFilmList();

    this.#renderFilmList();

    this.#renderSort();

    this.#renderShowMoreButton();

    this.#renderTopRatedFilms();

    this.#renderMostCommentedFilms();
  };
}
