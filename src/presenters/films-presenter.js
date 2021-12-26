import UserRankView from '../view/user-rank-view.js';
import NoFilmCardView from '../view/no-filmcard-view.js';
import SortButtonsCardsView from '../view/sort-cards-view.js';
import SectionFilmsView from '../view/container-card-view.js';
import FilmCardView from '../view/movie-card-view.js';
import ShowMoreButtonView from '../view/button-showmore-view.js';
import TopRatedFilmCardView from '../view/movie-card-top-rated-view.js';
import MostCommentedFilmCardView from '../view/movie-card-most-commented-view.js';
import PopupView from '../view/popup-view.js';
import PopupCommentsView from '../view/popup-comments-view.js';
import {remove, render, RenderPosition, replace} from '../render.js';
import { sorters, sortCards} from '../utils.js';

const CARD_COUNT_PER_STEP = 5;

const bodyElement = document.querySelector('body');
const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');

export default class FilmsPresenter {
  #filmListContainer = null;

  #userRankComponent = new UserRankView();
  #noFilmCardsComponent = new NoFilmCardView();
  #sortButtonsCardsComponent = new SortButtonsCardsView();
  #sectionFilmsComponent = new SectionFilmsView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #popupComponent = null;
  #filmCardComponent = null;

  #film = [];
  #renderedCardCount = CARD_COUNT_PER_STEP;

  constructor(filmListContainer) {
    this.#filmListContainer = filmListContainer;
  }

  init = (film) => {
    this.#film = film;
    render(siteMainElement, this.#sectionFilmsComponent, RenderPosition.BEFOREEND);
    this.#renderFilmsPage();
  }

  #renderPopup = (film) => {
    const previous = this.#popupComponent;
    this.#popupComponent = new PopupView(film);

    const popupComments = new PopupCommentsView(film.comments).element;
    const popupCommentsList = this.#popupComponent.element.querySelector('.film-details__comments-list');

    this.#popupComponent.setWatchListClickHandler(this.#openPopup);
    this.#popupComponent.setFavoriteClickHandler(this.#openPopup);
    this.#popupComponent.setWatchedClickHandler(this.#openPopup);

    this.#popupComponent.setClosePopupButtonClickHandler(this.#closePopup);

    if(previous === null) {
      render(siteFooter, this.#popupComponent.element, RenderPosition.AFTEREND);
      render(popupCommentsList, popupComments, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#popupComponent, previous);
    remove(previous);
  }

  #renderUserRank = () => {
    render(siteHeader, this.#userRankComponent, RenderPosition.BEFOREEND);
  }

  #renderSortButtons = () => {
    const filmCardsContainer = this.#sectionFilmsComponent.element.querySelector('.films-list__container');

    render(this.#sectionFilmsComponent, this.#sortButtonsCardsComponent, RenderPosition.BEFOREBEGIN);

    this.#sortButtonsCardsComponent.setClickHandler((evt) => {
      filmCardsContainer.innerHTML = '';
      sortCards(this.#film, evt.target.dataset.sortByType).slice(0,5).forEach((card) => {
        this.#renderFilmCard(card);
      });
    });
  }

  #renderNoFilms = () => {
    render(siteMainElement, this.#noFilmCardsComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmCard = (film) => {
    this.#filmCardComponent = new FilmCardView(film);
    const filmCardContainer = this.#sectionFilmsComponent.element.querySelector('.films-list__container');
    render(filmCardContainer,  this.#filmCardComponent, RenderPosition.BEFOREEND);

    this.#filmCardComponent.setWatchListClickHandler();

    this.#filmCardComponent.setWatchedClickHandler();

    this.#filmCardComponent.setFavoriteClickHandler();

    this.#filmCardComponent.setCardClickHandler(() => {
      this.#renderPopup(film);
    });
  }

  #renderFilmCards = (from, to) => {
    this.#film.slice(from, to).forEach((filmCard) => this.#renderFilmCard(filmCard));
  }

  #handleEsckeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopup();
    }
  };

  #handleShowMoreButtonClick = () => {
    this.#film
      .slice(this.#renderedCardCount, this.#renderedCardCount + CARD_COUNT_PER_STEP)
      .forEach((card) => this.#renderFilmCard(card));

    this.#renderedCardCount += CARD_COUNT_PER_STEP;

    if(this.#renderedCardCount >= this.#film.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #closePopup = () => {
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#handleEsckeyDown);
    remove(this.#popupComponent);
    this.#popupComponent = null;
  }

  #openPopup = () => {
    bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#handleEsckeyDown);
  }

  #renderShowMoreButton = () => {
    render(
      this.#sectionFilmsComponent.element.querySelector('.films-list'),
      this.#showMoreButtonComponent,
      RenderPosition.BEFOREEND);
    this.#showMoreButtonComponent.setEditClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderTopRatedFilm = (card) => {
    const topRatedFilmsComponent = new TopRatedFilmCardView(card);
    topRatedFilmsComponent.setCardButtonsClickHandler();

    const sectionTopRatedFilms = this.#sectionFilmsComponent.element
      .querySelector('.films-list--extra')
      .querySelector('.films-list__container');

    render(sectionTopRatedFilms, topRatedFilmsComponent, RenderPosition.BEFOREEND);
  }

  #renderTopRatedFilms = (from, to) => {
    [...this.#film]
      .sort(sorters.rating)
      .slice(from, to)
      .forEach((filmTopRated) => this.#renderTopRatedFilm(filmTopRated));
  }

  #renderMostCommentedFilm = (card) => {
    const mostCommentedFilmsComponent = new MostCommentedFilmCardView(card);
    mostCommentedFilmsComponent.setCardButtonsClickHandler();
    const sectionMostCommentedFilms = this.#sectionFilmsComponent.element
      .querySelector('.films-list--extra:last-child')
      .querySelector('.films-list__container');

    render(sectionMostCommentedFilms, mostCommentedFilmsComponent, RenderPosition.BEFOREEND);
  }

  #renderMostCommentedFilms = (from, to) => {
    [...this.#film]
      .sort(sorters.comments)
      .slice(from, to)
      .forEach((filmMostCommented) => this.#renderMostCommentedFilm(filmMostCommented));
  }

  #renderFilmCardList = () => {
    this.#renderFilmCards(0, Math.min(this.#film.length, CARD_COUNT_PER_STEP));

    if(this.#film > CARD_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderFilmsPage = () => {
    this.#renderUserRank();

    if(this.#film.length === 0) {
      this.#sectionFilmsComponent.element.innerHTML = '';
      this.#sortButtonsCardsComponent.element.innerHTML = '';
      this.#renderNoFilms();
      return;
    }

    this.#renderFilmCardList();

    this.#renderSortButtons();

    this.#renderShowMoreButton();

    this.#renderTopRatedFilms(0, 2);

    this.#renderMostCommentedFilms(0, 2);

  }
}
