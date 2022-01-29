import NoFilmView from '../view/no-film-view.js';
import LoadingView from '../view/loading-view.js'
import SortView from '../view/sort-view.js';
import FilmListView from '../view/film-list-view.js';
import ShowMoreButtonView from '../view/showmore-view.js';
import PopupView from '../view/popup-view.js';
import FilmPresenter from '../presenters/film-presenter.js';
import { siteMainElement, siteFooter } from '../main.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { sortFilmsType } from '../utils/sort.js';
import { filter } from '../utils/filter.js';
import { FilterType, SortType, UpdateType, UserAction } from '../const.js';

const FILM_COUNT_PER_STEP = 5;

const bodyElement = document.querySelector('body');

export default class FilmListPresenter {
#filmListContainer = null;
#filmsModel = null;
#commentsModel = null;
#filterModel = null;
#noFilmComponent = null;

#loadingComponent = new LoadingView();
#filmListComponent = new FilmListView();

#sortComponent = null;
#showMoreButtonComponent = null;
#popupComponent = null;

#filterType = FilterType.ALL_MOVIES;
#currentSortType = SortType.DEFAULT;
#renderedFilmCount = FILM_COUNT_PER_STEP;
#filmPresenter = new Map();
#filmCardTopRatedPresenters = new Map();
#filmCardMostCommentedPresenters = new Map();
#isLoading = true;

constructor(filmListContainer, filmsModel, filterModel, commentsModel) {
  this.#filmListContainer = filmListContainer;
  this.#filmsModel = filmsModel;
  this.#filterModel = filterModel;
  this.#commentsModel = commentsModel;
}

get films () {
  this.#filterType = this.#filterModel.filter;

  if (this.#filterModel.filter === 'stats') {
     return filter[FilterType.ALL_MOVIES](films);
    }

  const films = [...this.#filmsModel.films];
  const filteredFilms = filter[this.#filterType](films);

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

  init = () => {
    render(siteMainElement, this.#filmListComponent, RenderPosition.BEFOREEND);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#renderList();
  };

  destroy = () => {
    this.#clearList ({resetRenderedTaskCount: true, resetSortType: true});

    remove(this.#filmListComponent);
    remove(this.#sortComponent);

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
    this.#commentsModel.removeObserver(this.#handleModelEvent);
  }

  getComments = async (film) => {
    const commentsPromise = await this.#commentsModel.getСommentItems(film.id);
    const CommentsList = [...commentsPromise];
    return CommentsList;
  };

  #handleViewAction = (actionType, updateType, update, id, newComment) => {
    switch (actionType) {
      case UserAction.UPDATE:
        this.#filmsModel.updateFilm(updateType, update, id);
        break;
        case UserAction.UPDATE:
          this.#filmsModel.updateComments(updateType, update, id);
          break;
      case UserAction.ADD_COMMENT:
        this.#filmsModel.addComment(updateType, update, id, newComment);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsModel.deleteComment(updateType, update, id, newComment);
        break;
    }
  };

  #handleModelEvent = (updateType, data, comments) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data, comments);
        break;

      case UpdateType.MINOR:
        if(this.#popupComponent !== null) {
          this.#closePopup();
        }
        this.#renderPopup(data);
        this.#clearList();
        this.#renderList();
        break;

      case UpdateType.MAJOR:
        this.#clearList({resetRenderedFilmCount: true, resetSortType:true});
        this.#renderList();
        break;

      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearList();
        this.#renderList();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearList({resetRenderedFilmsCount: false});
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

  #renderLoading = () => {
    render(this.#filmListComponent, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

  #renderNoFilms = () => {
    this.#noFilmComponent = new NoFilmView(this.#filterType);
    remove(this.#sortComponent);
    render(this.#filmListComponent.filmListContainerTemplate, this.#noFilmComponent, RenderPosition.BEFOREBEGIN);
  };

  #handleFilmClick = (film) => {
    if(this.#popupComponent !== null) {
      this.#closePopup();
    }
    this.#renderPopup(film);
  };

  #handleFavoriteClick = (film) => {
    this.#handleViewAction(
      UserAction.UPDATE,
      UpdateType.MINOR,
      {...film, isFavorite: !film.isFavorite});
  }

  #handleWatchedClick = (film) => {
    this.#handleViewAction(
      UserAction.UPDATE,
      UpdateType.MINOR,
      {...film, isHistory: !film.isHistory});
  }

  #handleWatchListClick = (film) => {
    this.#handleViewAction(
      UserAction.UPDATE,
      UpdateType.MINOR,
      {...film, isWatchList: !film.isWatchList});
  };

  #handleShowMoreButtonClick = () => {

    this.films.slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach(this.#renderFilm);

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.films.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setEditClickHandler(this.#handleShowMoreButtonClick);

    render(this.#filmListComponent.filmListTemplate, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
  };

/*   #renderTopRatedFilm = (film) => {
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
  }; */

  #clearList = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#showMoreButtonComponent);
    remove(this.#loadingComponent);
    remove(this.#sortComponent);

    if(resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    if(this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }
  }

  #renderFilmList = () => {
    if (this.#isLoading) {
      remove(this.#sortComponent);
      this.#renderLoading();
      return;
    }

    this.#renderSort();

    const filmCount = this.films.length;

    if (filmCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.films.slice(0, this.#renderedFilmCount).forEach((film) => this.#renderFilm(film));

    if(this.#renderedFilmCount < this.films.length) {
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
    this.#popupComponent.setDeleteCommentButtonClickHandler(this.#handleDeleteComment);
    this.#popupComponent.setSubmitFormClickHandler(this.#handleSubmitComment);
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

  #handleDeleteComment = (film, commentId) => {
    const newFilm = {...film, comments: film.comments.filter((comment) => (comment.id !== commentId))};
    this.#handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      newFilm
    );
  }

  #handleSubmitComment = (film, newComment) => {
    this.film = {...film, ...film.comments.push(newComment)};
    this.#handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      this.film
    );
  };

  #renderList = () => {
    this.#renderFilmList();

    //this.#renderTopRatedFilms();

    //this.#renderMostCommentedFilms();
  };
}

