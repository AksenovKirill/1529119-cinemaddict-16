import UserRankView from '../view/user-rank-view.js';
import NoFilmView from '../view/no-film-view.js';
import SortView from '../view/sort-view.js';
import FilmListView from '../view/film-list-view.js';
import ShowMoreButtonView from '../view/showmore-view.js';
import PopupView from '../view/popup-view.js';
import FilmPresenter from '../presenters/film-presenter.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { sorters, sortFilmsType } from '../utils/film.js';
import { filmFilters } from '../utils/filter.js';
import { SortType, UpdateType, UserAction } from '../const.js';

const FILM_COUNT_PER_STEP = 5;

const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const bodyElement = document.querySelector('body');
const siteFooter = document.querySelector('.footer');

export default class FilmListPresenter {
#filmListContainer = null;
#filmsModel = null;
#filterModel = null;

#userRankComponent = new UserRankView();
#noFilmCardsComponent = new NoFilmView();
#filmListComponent = new FilmListView();

#sortComponent = null;
#showMoreButtonComponent = null;
#popupComponent = null;

#renderedFilmCount = FILM_COUNT_PER_STEP;
#filmPresenter = new Map();
#currentSortType = SortType.DEFAULT;

constructor(filmListContainer, filmsModel, filterModel) {
  this.#filmListContainer = filmListContainer;
  this.#filmsModel = filmsModel;
  this.#filterModel = filterModel;

  this.#filmsModel.addObserver(this.#handleModelEvent);
  this.#filterModel.addObserver(this.#handleModelEvent);
}

get films () {
  return [...this.#filmsModel.films];
}

sortFilms() {
  const filterType = this.#filterModel.filter;
  const films = this.#filmsModel.films;
  const filteredFilms = filmFilters[filterType](films);

  switch (this.#currentSortType) {
    case SortType.DATE:
      return sortFilmsType(filteredFilms, SortType.DATE);
    case SortType.RATING:
      return sortFilmsType(filteredFilms, SortType.RATING);
    default:
      return filteredFilms;
  }
}

  init = () => {
    render(siteMainElement, this.#filmListComponent, RenderPosition.BEFOREEND);
    this.#renderMainPage();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_TO_FAVORITE:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_TO_HISTORY:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_TO_WATCHLIST:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#filmsModel.addFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.updateFilm(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        if(this.#popupComponent !== null) {
          this.#closePopup();
        }
        this.#renderPopup(data);
        break;
      case UpdateType.MINOR:
        this.#filmPresenter.get(data.id).init(data);
        this.#clearMainPage();
        this.#renderFilmList();
        this.#renderShowMoreButton();
        if(this.#popupComponent !== null) {
          this.#closePopup();
        }
        this.#renderPopup(data);
        break;
      case UpdateType.MAJOR:
        this.#filmPresenter.get(data.id).init(data);
        this.#clearMainPage({resetRenderedFilmCount: true, resetSortType:true});
        this.#renderFilms();
        break;
    }
  };

  #renderUserRank = () => {
    const filmCount = this.films.length;
    render(siteHeader, this.#userRankComponent, RenderPosition.BEFOREEND);

    if (filmCount === 0) {
      remove(this.#filmListComponent);
      remove(this.#sortComponent);
      this.#renderNoFilms();
    }
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#filmListComponent,this.#sortComponent, RenderPosition.BEFOREBEGIN);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearMainPage({resetRenderedFilmCount: true});
    this.#renderFilmList();
    this.#renderShowMoreButton();
  }

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(
      this.#filmListComponent.filmListContainerTemplate, this.#handleViewAction, this.#handleFilmClick);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderNoFilms = () => {
    render(siteMainElement, this.#noFilmCardsComponent, RenderPosition.BEFOREEND);
  };

  #renderFilms = () => {
    this.sortFilms(this.films).slice(0, 5).forEach((film) => this.#renderFilm(film));
  };

  #handleFilmClick = (film) => {
    if(this.#popupComponent !== null) {
      this.#closePopup();
    }
    this.#renderPopup(film);
  };

  #renderPopup = (film) => {
    bodyElement.classList.add('hide-overflow');

    this.#popupComponent = new PopupView(film);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#popupComponent.setAddCommentHandler(this.#handleAddComment);
    this.#popupComponent.setDeleteCommentClickHandler(this.#handleDeleteComment);
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
    this.#handleViewAction(
      UserAction.ADD_TO_FAVORITE,
      UpdateType.MINOR,
      {...film, isFavorite: !film.isFavorite});
  }

  #handleWatchedClick = (film) => {
    this.#handleViewAction(
      UserAction.ADD_TO_HISTORY,
      UpdateType.MINOR,
      {...film, isHistory: !film.isHistory});
  }

  #handleWatchListClick = (film) => {
    this.#handleViewAction(
      UserAction.ADD_TO_WATCHLIST,
      UpdateType.MINOR,
      {...film, isWatchList: !film.isWatchList});
  };

  #handleAddComment = (film) => {
    this.#handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {...film, countComment: film.comments.length});
    // if((evt.ctrlKey) && ((evt.keyCode == 0xA)||(evt.keyCode == 0xD)))
  };

  #handleDeleteComment = (film) => {
    this.#handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {...film, countComment: film.comments.length});
  }

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setEditClickHandler(this.#handleShowMoreButtonClick);
    render(this.#filmListComponent.filmListTemplate, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
  };

  #handleShowMoreButtonClick = () => {
    this.sortFilms(this.films).slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach(this.#renderFilm);

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.films.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderTopRatedFilm = (film) => {
    const topRatedFilmsPresenter = new FilmPresenter(
      this.#filmListComponent.filmListTopRatedTemplate, this.#handleViewAction, this.#handleFilmClick
    );
    topRatedFilmsPresenter.init(film);
    this.#filmPresenter.set(film.id, topRatedFilmsPresenter);
  };

  #renderTopRatedFilms = () => {
    this.films.sort(sorters.rating).slice(0, 2).forEach(this.#renderTopRatedFilm);
  };

  #renderMostCommentedFilm = (film) => {
    const mostCommentedFilmsPresenter = new FilmPresenter(
      this.#filmListComponent.filmListMostCommentedTemplate, this.#handleViewAction, this.#handleFilmClick
    );
    mostCommentedFilmsPresenter.init(film);
    this.#filmPresenter.set(film.id, mostCommentedFilmsPresenter);
  };

  #renderMostCommentedFilms = () => {
    this.films.sort(sorters.comments).slice(0,2).forEach(this.#renderMostCommentedFilm);
  };

  #clearMainPage = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#noFilmCardsComponent);
    remove(this.#showMoreButtonComponent);

    if(resetRenderedFilmCount) {
      this.#renderedFilmCount = this.#renderedFilmCount + FILM_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderFilmList = () => {
    const films = this.films;
    const filmCount = films.length;

    if (filmCount === 0) {
      this.#renderNoFilms();
      return;
    }
    this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));
  };

  #renderMainPage = () => {
    this.#renderUserRank();

    this.#clearMainPage();

    this.#renderFilmList();

    this.#renderSort();

    this.#renderShowMoreButton();

    this.#renderTopRatedFilms();

    this.#renderMostCommentedFilms();
  };
}
