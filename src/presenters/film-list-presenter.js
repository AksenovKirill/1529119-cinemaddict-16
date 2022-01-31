import UserRankView from '../view/user-rank-view.js';
import NoFilmView from '../view/no-film-view.js';
import LoadingView from '../view/loading-view.js';
import SortView from '../view/sort-view.js';
import FilmListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/showmore-view.js';
import TopRatedView from '../view/films-top-rated-view';
import MostCommentedView from '../view/films-most-commented-view.js';
import PopupView from '../view/popup-view.js';
import FilmPresenter from '../presenters/film-presenter.js';
import { siteMainElement, siteFooter } from '../main.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { sortFilmsType, sorters } from '../utils/sort.js';
import { filter } from '../utils/filter.js';
import { FilterType, SortType, UpdateType, UserAction, FILM_COUNT_PER_STEP, State } from '../const.js';

const bodyElement = document.querySelector('body');
const siteHeader = document.querySelector('.header');

export default class FilmListPresenter {
#filmListContainer = null;
#filmsModel = null;
#filterModel = null;
#noFilmComponent = null;
#userRankComponent = null;

#loadingComponent = new LoadingView();
#filmListComponent = new FilmListView();
#topRatedComponent = new TopRatedView();
#mostCommentedComponent = new MostCommentedView();
#showMoreButtonComponent = new ShowMoreButtonView();

#sortComponent = null;
#popupComponent = null;
#scrollPopup = null;
#filterType = FilterType.ALL_MOVIES;
#currentSortType = SortType.DEFAULT;
#renderedFilmCount = FILM_COUNT_PER_STEP;
#filmPresenter = new Map();
#filmTopRatedPresenter = new Map();
#filmMostCommentedPresenter = new Map();
#isLoading = true;

constructor(filmListContainer, filmsModel, filterModel) {
  this.#filmListContainer = filmListContainer;
  this.#filmsModel = filmsModel;
  this.#filterModel = filterModel;
}

get films () {
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

    this.#renderList();

    if (this.#isLoading) {
      remove(this.#noFilmComponent);
      remove(this.#sortComponent);
      remove(this.#topRatedComponent);
      remove(this.#mostCommentedComponent);
      this.#renderLoading();
    }
  };

  destroy = () => {
    this.#clearList ({resetRenderedTaskCount: true, resetSortType: true});

    remove(this.#filmListComponent);
    remove(this.#sortComponent);

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        try {
          await this.#filmsModel.updateFilm(updateType, update);
        } catch(error) {
          this.#setViewState(State.ABORTING);
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#setViewState(State.ADDING);
        try {
         await this.#filmsModel.addComment(updateType, update, this.#filmId);
         this.#popupComponent.reset(this.#film);
        } catch(error) {
          this.#setViewState(State.ABORTING);
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#setViewState(State.ADDING);
        try {
          await this.#filmsModel.deleteComment(updateType, update);
        } catch(error) {
          this.#setViewState(State.ABORTING);
        }
        break;
        default:
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
        this.#renderFilmList();
        break;

      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearList();
        this.#renderList();

        break;
    }
  };

  #setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }
    const resetFormState = () => {
      this.#popupComponent.updateData({
        isDisabled: false,
      });
    };
    switch (state) {
      case State.ADDING:
        this.#popupComponent.updateData({
          isDisabled: true,
        });
        break;
      case State.DELETING:
        this.#popupComponent.updateData({
          isDisabled: true,
        });
        break;
      case State.ABORTING:
        this.#filmCardComponent.shake(resetFormState);
        this.#popupComponent.shake(resetFormState);
        break;
    }
  }

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
    const filmPresenter = new FilmPresenter(this.#filmListComponent.filmListContainerTemplate, this.#handleViewAction, this.#handleFilmClick);
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

  #renderUserRank = () => {
    if (this.#userRankComponent !== null) {
      this.#userRankComponent = null;
    }
    this.#userRankComponent = new UserRankView(this.#filmsModel.films);
    render(siteHeader, this.#userRankComponent, RenderPosition.BEFOREEND);
  }

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
    this.#showMoreButtonComponent.setEditClickHandler(this.#handleShowMoreButtonClick);
    render(this.#filmListComponent.filmListTemplate, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
  };

  #renderTopRatedFilm = () => {
    render(this.#filmListComponent, this.#topRatedComponent, RenderPosition.BEFOREEND);
  };

  #renderTopRatedFilms = () => {
    // const topRatedFilmsPresenter = new FilmPresenter(this.#topRatedComponent, this.#handleViewAction, this.#handleFilmClick);
    // topRatedFilmsPresenter.init(film);
    // this.#filmTopRatedPresenter.set(film.id, topRatedFilmsPresenter);
    //this.films.sort(sorters.rating).slice(0, 2).forEach(this.#renderFilm);
  };

  #renderMostCommentedFilm = () => {
    render(this.#filmListComponent, this.#mostCommentedComponent, RenderPosition.BEFOREEND);
    //const mostCommentedFilmsPresenter = new FilmPresenter(
    //this.#filmListComponent.filmListMostCommentedTemplate, this.#handleViewAction, this.#handleFilmClick);
    //mostCommentedFilmsPresenter.init(film);
    //filmMostCommentedPresenter.set(film.id, mostCommentedFilmsPresenter);
  };

  #renderMostCommentedFilms = () => {
    //this.films.sort(sorters.comments).slice(0,2).forEach(this.#renderMostCommentedFilm);
  };

  #clearList = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#filmTopRatedPresenter.clear();
    this.#filmMostCommentedPresenter.clear();

    remove(this.#userRankComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#loadingComponent);

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
    document.addEventListener('keydown', this.#handleEscKeyDown);

    if (this.#scrollPopup) {
      this.#popupComponent.element.scroll(0, this.#scrollPopup);
    }

    render(siteFooter, this.#popupComponent, RenderPosition.AFTEREND);

  }

  #closePopup = () => {
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#handleEscKeyDown);

    remove(this.#popupComponent);
    this.#popupComponent = null;
  };

/*   #handleScroll = () => {
  }
 */

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
    this.#renderUserRank();
    this.#renderSort();
    this.#renderFilmList();
    this.#renderTopRatedFilm();
    this.#renderMostCommentedFilm();
  };
}

