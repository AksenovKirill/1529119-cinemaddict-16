import UserRankView from '../view/user-rank-view.js';
import NoFilmCardView from '../view/no-filmcard-view.js';
import SortButtonsCardsView from '../view/sort-cards-view.js';
import SectionFilmsView from '../view/film-list-view.js';
import ShowMoreButtonView from '../view/button-showmore-view.js';
import PopupView from '../view/popup-view.js';
import FilmPresenter from '../presenters/film-presenter.js';
import { remove, render, RenderPosition, updateItem } from '../render.js';
import { sorters, sortCards } from '../utils.js';

const CARD_COUNT_PER_STEP = 5;

const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
export const bodyElement = document.querySelector('body');
const siteFooter = document.querySelector('.footer');

export default class FilmsPresenter {
#filmListContainer = null;

#userRankComponent = new UserRankView();
#noFilmCardsComponent = new NoFilmCardView();
#sortButtonsCardsComponent = new SortButtonsCardsView();
#filmListComponent = new SectionFilmsView();
#showMoreButtonComponent = new ShowMoreButtonView();
#popupComponent = null;

#films = [];
#renderedCardCount = CARD_COUNT_PER_STEP;
#filmPresenter = new Map();

constructor(filmListContainer) {
  this.#filmListContainer = filmListContainer;
}

  init = (films) => {
    this.#films = films;
    render(siteMainElement, this.#filmListComponent, RenderPosition.BEFOREEND);
    this.#renderFilmsPage();
  };

  #renderSortButtons = () => {
    render(
      this.#filmListComponent,
      this.#sortButtonsCardsComponent,
      RenderPosition.BEFOREBEGIN
    );

    this.#sortButtonsCardsComponent.setClickHandler((evt) => {
      this.#filmListComponent.filmListContainerTemplate.innerHTML = '';
      sortCards(this.#films, evt.target.dataset.sortByType)
        .slice(0, 5)
        .forEach((film) => {
          this.#renderFilmCard(film);
        });
      this.#renderShowMoreButton();
    });
  };

  #renderFilmCard = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmListComponent.filmListContainerTemplate, this.#handleCardClick);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #handleCardClick = (film) => {
    if(this.#popupComponent !== null) {
      this.#closePopup();
    }
    this.#renderPopup(film);
    //this.#films = updateItem(this.#films, updateFilm);
    //this.#filmPresenter.get(updateFilm.id).init(updateFilm);
  };

  #renderFilmCards = (from, to) => {
    this.#films.slice(from, to).forEach((film) => this.#renderFilmCard(film));
  };

  #renderPopup = (film) => {
    bodyElement.classList.add('hide-overflow');

    this.#popupComponent = new PopupView(film);
    this.#popupComponent.setClosePopupButtonClickHandler(this.#closePopup);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupComponent.setWatchListClickHandler(this.#handleWatchListClick);

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
    updateItem({ ...film, isFavorite: !film.isFavorite });
  };

  #handleWatchedClick = (film) => {
    updateItem({ ...film, isHistory: !film.isHistory });
  };

  #handleWatchListClick = (film) => {
    updateItem({ ...film, isWatchList: !film.watchList });
  };

  #renderNoFilms = () => {
    render(siteMainElement, this.#noFilmCardsComponent, RenderPosition.BEFOREEND);
  };

  #handleShowMoreButtonClick = () => {
    this.#films
      .slice(
        this.#renderedCardCount,
        this.#renderedCardCount + CARD_COUNT_PER_STEP)
      .forEach((card) => this.#renderFilmCard(card));

    this.#renderedCardCount += CARD_COUNT_PER_STEP;

    if (this.#renderedCardCount >= this.#films.length) {
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
    this.#renderedCardCount = CARD_COUNT_PER_STEP;
  };

  #renderUserRank = () => {
    render(siteHeader, this.#userRankComponent, RenderPosition.BEFOREEND);

    if (this.#films.length === 0) {
      this.#filmListComponent.element.innerHTML = '';
      this.#sortButtonsCardsComponent.element.innerHTML = '';
      this.#renderNoFilms();
    }
  };

  #renderTopRatedFilm = (film) => {
    const topRatedFilmsPresenter = new FilmPresenter(this.#filmListComponent.filmListTopRatedTemplate, this.#handleCardClick);
    topRatedFilmsPresenter.init(film);
  };

  #renderTopRatedFilms = (from, to) => {
    [...this.#films]
      .sort(sorters.rating)
      .slice(from, to)
      .forEach((film) => this.#renderTopRatedFilm(film));
  };

  #renderMostCommentedFilm = (film) => {
    const mostCommentedFilmsPresenter = new FilmPresenter(this.#filmListComponent.filmListMostCommentedTemplate, this.#handleCardClick);
    mostCommentedFilmsPresenter.init(film);
  };

  #renderMostCommentedFilms = (from, to) => {
    [...this.#films]
      .sort(sorters.comments)
      .slice(from, to)
      .forEach((film) => this.#renderMostCommentedFilm(film));
  };

  #renderFilmCardList = () => {
    this.#renderFilmCards(0, Math.min(this.#films.length, CARD_COUNT_PER_STEP));

    if (this.#films > CARD_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderFilmsPage = () => {
    this.#renderUserRank();

    this.#clearFilmList();

    this.#renderFilmCardList();

    this.#renderSortButtons();

    this.#renderShowMoreButton();

    this.#renderTopRatedFilms(0, 2);

    this.#renderMostCommentedFilms(0, 2);
  };
}
