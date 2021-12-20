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
import PopupNewCommentsView from '../view/popup-new-comments-view.js';
import {render, RenderPosition} from '../render.js';
import { sorters, sortCards} from '../utils.js';

const CARD_COUNT_PER_STEP = 5;
const bodyElement = document.querySelector('body');
const siteMainElement = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');
const siteHeader = document.querySelector('.header');


export default class FilmListPresenter {
  #filmListContainer = null;

  #userRankComponent = new UserRankView();
  #noFilmCardsComponent = new NoFilmCardView();
  #sortButtonsCardsComponent = new SortButtonsCardsView();
  #sectionFilmsComponent = new SectionFilmsView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #listFilmCards = [];
  #renderedCardCount = CARD_COUNT_PER_STEP;



  constructor(filmListContainer) {
    this.#filmListContainer = filmListContainer;
  }

  init = (listFilmCards) => {
    this.#listFilmCards = [...listFilmCards];
    render(siteMainElement, this.#sectionFilmsComponent, RenderPosition.BEFOREEND);
    this.#renderMainPage();
  }

  #renderUserRank = () => {
    render(siteHeader, this.#userRankComponent, RenderPosition.BEFOREEND);
  }

  #renderSortButtons = () => {
    const filmCardsContainer = this.#sectionFilmsComponent.element.querySelector('.films-list__container');

    render(this.#sectionFilmsComponent, this.#sortButtonsCardsComponent, RenderPosition.BEFOREBEGIN);

    this.#sortButtonsCardsComponent.setClickHandler((evt) => {
      filmCardsContainer.innerHTML = '';
      sortCards(this.#listFilmCards, evt.target.dataset.sortByType).slice(0,5).forEach((card) => {
        this.#renderFilmCard(card);
      });
    });
  }

  #renderNoFilms = () => {
      render(siteMainElement, this.#noFilmCardsComponent, RenderPosition.BEFOREEND);
  }

  #renderPopup = (data) => {
    const popupComponent = new PopupView(data);
    const popupComments = new PopupCommentsView(data.comments).element;

    const popupNewComments = new PopupNewCommentsView(data.comments).element;
    const popupListContainer = popupComponent.element.querySelector('.film-details__comments-list');

    render(siteFooter, popupComponent.element, RenderPosition.AFTEREND);

    render(popupListContainer, popupComments, RenderPosition.AFTERBEGIN);

    render(popupListContainer, popupNewComments, RenderPosition.AFTEREND);

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        bodyElement.classList.remove('hide-overflow');
        popupComponent.element.remove(bodyElement);
      }
    };

    document.addEventListener('keydown', onEscKeyDown);

    popupComponent.setEditClickCloseButtonHandler(() => {
      popupComponent.element.remove(bodyElement);
      bodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeyDown);
    });
  }

  #renderFilmCard = (card) => {
    const filmCardComponent = new FilmCardView(card);
    const filmCardsContainer = this.#sectionFilmsComponent.element.querySelector('.films-list__container');
    filmCardComponent.setEditClickHandler(() => {
      bodyElement.classList.add('hide-overflow');
      this.#renderPopup(card);
    });

    render(filmCardsContainer, filmCardComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmCards = (from, to) => {
    this.#listFilmCards.slice(from, to).forEach((filmCard) => this.#renderFilmCard(filmCard));
  }

  #renderShowMoreButton = () => {
    const filmListContainer = this.#sectionFilmsComponent.element.querySelector('.films-list');

    render(filmListContainer, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);

    this.#showMoreButtonComponent.setEditClickHandler(() => {
      this.#listFilmCards
        .slice(this.#renderedCardCount, this.#renderedCardCount + CARD_COUNT_PER_STEP)
        .forEach((card) => this.#renderFilmCard(card));

      this.#renderedCardCount += CARD_COUNT_PER_STEP;

      if(this.#renderedCardCount >= this.#listFilmCards.length) {
        this.#showMoreButtonComponent.element.remove(filmListContainer);
      }
    });
  }

  #renderTopRatedFilm = (card) => {
  const topRatedFilmsComponent = new TopRatedFilmCardView(card);

  const sectionTopRatedFilms = this.#sectionFilmsComponent.element
  .querySelector('.films-list--extra')
  .querySelector('.films-list__container');

  render(sectionTopRatedFilms, topRatedFilmsComponent, RenderPosition.BEFOREEND);
  }

  #renderTopRatedFilms = (from, to) => {
    [...this.#listFilmCards]
    .sort(sorters.rating)
    .slice(from, to)
    .forEach((filmTopRated) => this.#renderTopRatedFilm(filmTopRated));
  }

  #renderMostCommentedFilm = (card) => {
    const mostCommentedFilmsComponent = new MostCommentedFilmCardView(card);
    const sectionMostCommentedFilms = this.#sectionFilmsComponent.element
    .querySelector('.films-list--extra:last-child')
    .querySelector('.films-list__container');

    render(sectionMostCommentedFilms, mostCommentedFilmsComponent, RenderPosition.BEFOREEND);
  }

  #renderMostCommentedFilms = (from, to) => {
    [...this.#listFilmCards]
    .sort(sorters.comments)
    .slice(from, to)
    .forEach((filmMostCommented) => this.#renderMostCommentedFilm(filmMostCommented));
  }

  #renderFilmCardList = () => {
    this.#renderFilmCards(0, Math.min(this.#listFilmCards.length, CARD_COUNT_PER_STEP));

    if(this.#listFilmCards > CARD_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderMainPage = () => {
  this.#renderUserRank();

    if(this.#listFilmCards.length === 0) {
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
