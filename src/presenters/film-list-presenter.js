import UserRankView from '../view/user-rank-view.js';
import NoFilmView from '../view/no-film-view.js';
import SortView from '../view/sort-view.js';
import FilmListView from '../view/film-list-view.js';
import ShowMoreButtonView from '../view/showmore-view.js';
import PopupView from '../view/popup-view.js';
import FilmPresenter from '../presenters/film-presenter.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { sorters, sortFilmsType } from '../utils/sort.js';
import { filter } from '../utils/filter.js';
import { FilterType, SortType, UpdateType, UserAction } from '../const.js';

const FILM_COUNT_PER_STEP = 5;

const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const bodyElement = document.querySelector('body');
const siteFooter = document.querySelector('.footer');

export default class FilmListPresenter {
#filmListContainer = null;
#filmsModel = null;
#filterModel = null;
#noFilmComponent = null;

#userRankComponent = new UserRankView();
#filmListComponent = new FilmListView();

#sortComponent = null;
#showMoreButtonComponent = null;
#popupComponent = null;
#currentSortType = SortType.DEFAULT;
#renderedFilmCount = FILM_COUNT_PER_STEP;
#filmPresenter = new Map();
#filterType = FilterType.ALL_MOVIES;


constructor(filmListContainer, filmsModel, filterModel) {
  this.#filmListContainer = filmListContainer;
  this.#filmsModel = filmsModel;
  this.#filterModel = filterModel;

  this.#filmsModel.addObserver(this.#handleModelEvent);
  this.#filterModel.addObserver(this.#handleModelEvent);
}

get films () {
  return this.#filmsModel.films;
}

filterFilms(films) {
  this.#filterType = this.#filterModel.filter;
  return filter[this.#filterType](films);
}

sortFilms(films) {
  switch (this.#currentSortType) {
    case SortType.DATE:
      return sortFilmsType(films, SortType.DATE);
    case SortType.RATING:
      return sortFilmsType(films, SortType.RATING);
      case SortType.DEFAULT:
      return films;
  }
}

  init = () => {
    render(siteMainElement, this.#filmListComponent, RenderPosition.BEFOREEND);
    this.#renderList();
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
        this.#filmsModel.updateFilm(updateType, update);
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
        if(this.#popupComponent !== null) {
          this.#closePopup();
        }
        this.#renderPopup(data);

        this.#clearList();
        this.#renderFilmList();

        break;

      case UpdateType.MAJOR:
        this.#clearList({resetRenderedFilmCount: true, resetSortType:true});
        this.#renderFilmList();
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

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearList();
    this.#renderFilmList();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#filmListComponent,this.#sortComponent, RenderPosition.BEFOREBEGIN);
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(
      this.#filmListComponent.filmListContainerTemplate, this.#handleViewAction, this.#handleFilmClick);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderNoFilms = () => {
    this.#noFilmComponent = new NoFilmView(this.#filterType);

    render(siteMainElement, this.#noFilmComponent, RenderPosition.BEFOREEND);
  };

  #handleFilmClick = (film) => {
    if(this.#popupComponent !== null) {
      this.#closePopup();
    }
    this.#renderPopup(film);
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

  #handleShowMoreButtonClick = () => {
    const filteredFilms = this.filterFilms(this.films);
    const sortedFilms = this.sortFilms(filteredFilms);

    sortedFilms.slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach(this.#renderFilm);

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= sortedFilms.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setEditClickHandler(this.#handleShowMoreButtonClick);

    render(this.#filmListComponent.filmListTemplate, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
  };

  #renderTopRatedFilm = (film) => {
    const topRatedFilmsPresenter = new FilmPresenter(
      this.#filmListComponent.filmListTopRatedTemplate, this.#handleViewAction, this.#handleFilmClick
    );
    topRatedFilmsPresenter.init(film);
    //this.#filmPresenter.set(film.id, topRatedFilmsPresenter);
  };

  #renderTopRatedFilms = () => {
    this.films.sort(sorters.rating).slice(0, 2).forEach(this.#renderTopRatedFilm);
  };

  #renderMostCommentedFilm = (film) => {
    const mostCommentedFilmsPresenter = new FilmPresenter(
      this.#filmListComponent.filmListMostCommentedTemplate, this.#handleViewAction, this.#handleFilmClick
    );
    mostCommentedFilmsPresenter.init(film);
    //this.#filmPresenter.set(film.id, mostCommentedFilmsPresenter);
  };

  #renderMostCommentedFilms = () => {
    this.films.sort(sorters.comments).slice(0,2).forEach(this.#renderMostCommentedFilm);
  };

  #clearList = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#showMoreButtonComponent);
    remove(this.#noFilmComponent);

    if(this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }

    if(resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderFilmList = () => {
    const filteredFilms = this.filterFilms(this.films);
    const sortedFilms = this.sortFilms(filteredFilms);
    const filmCount = sortedFilms.length;


    if (filmCount === 0) {
      this.#renderNoFilms();
      return;
    }

    sortedFilms.slice(0, this.#renderedFilmCount).forEach((film) => this.#renderFilm(film));

    if(this.#renderedFilmCount < sortedFilms.length) {
      this.#renderShowMoreButton();
    }
  };

  #renderPopup = (film) => {
    bodyElement.classList.add('hide-overflow');

    this.#popupComponent = new PopupView(film);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#popupComponent.setClosePopupButtonClickHandler(this.#closePopup);
    this.#popupComponent.setDeleteCommentHandler(this.#handleDeleteComment);
    //this.#popupComponent.setAddCommentHandler(this.#handleAddComment);
    document.addEventListener('keydown', this.#handleEscKeyDown);
    document.addEventListener('keydown', this.#handleCtrlEnterKeyDown);

    render(siteFooter, this.#popupComponent, RenderPosition.AFTEREND);
  }

  #closePopup = () => {
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#handleEscKeyDown);
    document.removeEventListener('keydown', this.#handleCtrlEnterKeyDown);
    remove(this.#popupComponent);
    this.#popupComponent = null;
  };

  #handleEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopup();
    }
  };

  #handleCtrlEnterKeyDown = (evt) => {
    if((evt.ctrlKey) && ((evt.keyCode == 0xA)||(evt.keyCode == 0xD))) {
      this.#handleAddComment();
    }
  }

  #handleDeleteComment = (film, commentId) => {
    const newFilm =  {...film, comments: film.comments.filter((comment) => (comment.id !== commentId))};
    this.#handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      newFilm
    );
  }

  #handleAddComment = (film) => {
    const newFilm =  {...film, comments: film.comments.push((comment))};
    this.#handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      newFilm
      );
  }

  #renderList = () => {
    this.#renderUserRank();

    this.#clearList();

    this.#renderFilmList();

    this.#renderSort();

    this.#renderTopRatedFilms();

    this.#renderMostCommentedFilms();
  };
}

