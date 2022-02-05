import UserRankView from '../view/user-rank-view.js';
import FooterView from '../view/footer-view.js';
import NoFilmView from '../view/no-film-view.js';
import LoadingView from '../view/loading-view.js';
import SortView from '../view/sort-view.js';
import FilmListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-view.js';
import PopupView from '../view/popup-view.js';
import FilmPresenter from '../presenters/film-presenter.js';
import {siteMainElement} from '../main.js';
import {remove, render} from '../utils/render.js';
import {sortFilmsType} from '../utils/sort.js';
import {filter} from '../utils/filter.js';
import {RenderPosition} from '../const.js';
import {
  FilterType,
  SortType,
  UpdateType,
  UserAction,
  FILM_COUNT_PER_STEP,
  State,
} from '../const.js';

const bodyElement = document.querySelector('body');
const siteHeader = document.querySelector('.header');
const siteFooter = document.querySelector('.footer');

export default class FilmListPresenter {
  #filmListContainer = null;
  #filmsModel = null;
  #filterModel = null;
  #noFilmComponent = null;
  #userRankComponent = null;
  #sortComponent = null;
  #popupComponent = null;
  #footerComponent = null;
  #loadingComponent = new LoadingView();
  #filmListComponent = new FilmListView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #filterType = FilterType.ALL_MOVIES;
  #currentSortType = SortType.DEFAULT;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #isLoading = true;

  constructor(filmListContainer, filmsModel, filterModel) {
    this.#filmListContainer = filmListContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
  }

  get films() {
    const films = [...this.#filmsModel.films];
    this.#filterType = this.#filterModel.filter;
    const filteredFilms = filter[this.#filterType](films);

    if (this.#filterModel.filter === 'stats') {
      return filter[FilterType.ALL_MOVIES](films);
    }

    switch (this.#currentSortType) {
      case SortType.DEFAULT:
        return filteredFilms;
      case SortType.DATE:
        return sortFilmsType(filteredFilms, SortType.DATE);
      case SortType.RATING:
        return sortFilmsType(filteredFilms, SortType.RATING);
    }
    return filter[this.#filterType](this.#filmsModel.films);
  }

  init = async () => {
    render(siteMainElement, this.#filmListComponent, RenderPosition.BEFOREEND);
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    if (this.#isLoading) {
      this.#renderLoading();
    }
    this.#renderFilmList();
  };

  destroy = () => {
    this.#clearList({resetRenderedTaskCount: true, resetSortType: true});

    remove(this.#filmListComponent);
    remove(this.#loadingComponent);
    remove(this.#noFilmComponent);
    remove(this.#sortComponent);

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  };

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE:
        try {
          await this.#filmsModel.updateFilm(updateType, update);
        } catch (error) {
          throw new Error('Can\'t add comment');
        }
        break;
      case UserAction.ADD_COMMENT:
        try {
          this.setViewState(State.ADDING);
        } catch (error) {
          this.setViewState(State.ABORTING);
        }
        break;
      case UserAction.DELETE_COMMENT:
        try {
          this.setViewState(State.DELETING);
        } catch (error) {
          this.setViewState(State.ABORTING);
        }
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        if (this.#popupComponent !== null) {
          this.#closePopup();
          this.#renderPopup(data);
        }
        break;
      case UpdateType.MINOR:
        if (this.#popupComponent !== null) {
          this.#closePopup();
          this.#renderPopup(data);
        }
        this.#clearList();
        this.#renderNoFilms();
        this.#renderUserRank(data);
        this.#renderFilmList();
        break;
      case UpdateType.MAJOR:
        this.#clearList({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderUserRank(data);
        this.#renderSort();
        this.#renderNoFilms();
        this.#renderFilmList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderNoFilms(data);
        this.#renderSort();
        this.#renderUserRank(data);
        this.#renderFilmList();
        this.#renderFooter(data);
        break;
    }
  };

  setViewState = (state, film) => {
    switch (state) {
      case State.ADDING:
        this.#popupComponent.updateData({...film,
          isDisabled: true,
        });
        break;
      case State.UPDATING:
        this.#popupComponent.updateData({
          isDisabled: false
        });
        break;
      case State.DELETING:
        this.#popupComponent.updateData({...film,
          isDisabled: true,
        });
        break;
      case State.ABORTING:
        this.#popupComponent.updateData({
          isDisabled: false,
        });
        this.#popupComponent.shake();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    this.#clearList({resetRenderedFilmsCount: false});
    this.#renderUserRank();
    this.#renderFilmList();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    const filmCount = this.films.length;
    if(filmCount === 0) {
      return;
    }
    render(this.#filmListComponent,this.#sortComponent,RenderPosition.BEFOREBEGIN);
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(
      this.#filmListComponent.filmListContainerTemplate,
      this.#handleViewAction,
      this.#handleFilmClick,
    );
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderLoading = () => {
    remove(this.#sortComponent);
    render(
      this.#filmListComponent,
      this.#loadingComponent,
      RenderPosition.AFTERBEGIN,
    );
  };

  #renderNoFilms = () => {
    this.#noFilmComponent = new NoFilmView(this.#filterType);
    const filmCount = this.films.length;
    if (filmCount === 0) {
      remove(this.#sortComponent);
      render(
        this.#filmListComponent.filmListContainerTemplate,
        this.#noFilmComponent,
        RenderPosition.BEFOREBEGIN,
      );
    }
  };

  #renderUserRank = () => {
    if (this.#userRankComponent !== null) {
      this.#userRankComponent = null;
    }
    this.#userRankComponent = new UserRankView(this.#filmsModel.films);
    render(siteHeader, this.#userRankComponent, RenderPosition.BEFOREEND);
  };

  #handleFilmClick = (film) => {
    if (this.#popupComponent !== null) {
      this.#closePopup();
    }
    this.#renderPopup(film);
  };

  #handleFavoriteClick = (film) => {
    this.#handleViewAction(UserAction.UPDATE, UpdateType.MINOR, {
      ...film,
      isFavorite: !film.isFavorite,
    });
  };

  #handleWatchedClick = (film) => {
    this.#handleViewAction(UserAction.UPDATE, UpdateType.MINOR, {
      ...film,
      isHistory: !film.isHistory,
    });
  };

  #handleWatchListClick = (film) => {
    this.#handleViewAction(UserAction.UPDATE, UpdateType.MINOR, {
      ...film,
      isWatchList: !film.isWatchList,
    });
  };

  #handleShowMoreButtonClick = () => {
    this.films
      .slice(
        this.#renderedFilmCount,
        this.#renderedFilmCount + FILM_COUNT_PER_STEP,
      )
      .forEach(this.#renderFilm);

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.films.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent.setEditClickHandler(
      this.#handleShowMoreButtonClick,
    );
    render(
      this.#filmListComponent.filmListTemplate,
      this.#showMoreButtonComponent,
      RenderPosition.BEFOREEND,
    );
  };

  #clearList = ({
    resetRenderedFilmCount = false,
    resetSortType = false,
  } = {}) => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#userRankComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#loadingComponent);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    }
    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
    if (this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }
  };

  #renderFilmList = () => {
    this.films
      .slice(0, this.#renderedFilmCount)
      .forEach((film) => this.#renderFilm(film));

    if (this.#renderedFilmCount < this.films.length) {
      this.#renderShowMoreButton();
    }
  };

  #renderFooter = () => {
    this.#footerComponent = new FooterView(this.#filmsModel.films);
    render(siteFooter, this.#footerComponent, RenderPosition.BEFOREEND);
  }

  #renderPopup = async (film) => {
    bodyElement.classList.add('hide-overflow');
    const comments = await this.#filmsModel.getComments(film.id);
    this.#popupComponent = new PopupView(film, comments);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#popupComponent.setClosePopupButtonClickHandler(this.#closePopup);
    this.#popupComponent.setDeleteClickHandler(this.#handleDeleteComment);
    this.#popupComponent.setSubmitFormClickHandler(this.#handleSubmitComment);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    render(siteFooter, this.#popupComponent, RenderPosition.AFTEREND);
  };

  #closePopup = () => {
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#popupComponent.setRemoveHandlers();
    remove(this.#popupComponent);
    this.#popupComponent = null;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopup();
    }
  };

  #handleDeleteComment = async (film, commentId) => {
    try {
      await this.#filmsModel.deleteComment(UpdateType.PATCH, film, commentId);
    } catch (error) {
      this.#popupComponent.shake( () => {
        this.#popupComponent.updateData({
          idDeleting: false,
          isDisabled: false,
          deletingCommentId: undefined,
        });
      });
    }
  };

  #handleSubmitComment = async (film, newComment) => {
    try {
      await  this.#filmsModel.addComment(UpdateType.PATCH, {newComment, filmId: film.id});
    } catch (error) {
      this.#popupComponent.shake( () => {
        this.#popupComponent.updateData({
          isDisabled: false,
        });
      });
    }
  }
}
