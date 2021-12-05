import {render, RenderPosition} from './render.js';
import {generateFilmCard, getRandomElements} from './mock/generateCards.js';

import UserRankView from './view/user-rank-view.js';
import SiteMenuView from './view/site-menu-view.js';
import SortCardsView from './view/sort-cards-view.js';
import SectionFilmsView from './view/container-card-view.js';
import FilmCard from './view/movie-card-view.js';
import ButtonsControlFilmCardView from './view/buttons-control-film-card-view.js';
import ButtonShowMoreView from './view/button-showmore-view.js';
import ContainerTopRaitedFilmView from './view/container-top-rated-view.js';
import ContainerMostCommentedFilmView from './view/container-most-commented-view';
import TopRatedFilmCardView from './view/movie-card-top-rated-view.js';
import MostCommentedFilmCardView from './view/movie-card-most-commented-view.js';
import FooterStatisticsView from './view/footer-statistics-view.js';
import ContainerPopupView  from './view/container-popup-view.js';
import ButtonClosePopupView from './view/button-close-popup-view.js';
import PopupView from './view/popup-view.js';
import ButtonsControlPopupView from './view/buttons-control-popup-view.js';
import PopupCommentsView from './view/popup-comments-view.js';
import PopupNewCommentsView from './view/popup-new-comments-view.js';
import AmountCommentsView from './view/popup-amount-comments-view.js';

const CARD_COUNT_PER_STEP = 5;
const MOCK_DATA_COUNT = 20;
let renderedCardCount = CARD_COUNT_PER_STEP;

const mockCardData = Array.from({ length: MOCK_DATA_COUNT }, generateFilmCard);
export const sortDataByRaitings = mockCardData.slice().sort((a,b) => b.raiting - a.raiting);
export const sortDataByComments = mockCardData.slice().sort((a,b) => b.comments.length - a.comments.length);
export const sortDataByDate = mockCardData.slice().sort((a,b) => b.year - a.year);

const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');
const siteFooterStatistics = siteFooter.querySelector('.footer__statistics');

render(siteHeader, new UserRankView().element, RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView().element, RenderPosition.AFTERBEGIN);

const siteMenuElement = document.querySelector('.main-navigation');

render(siteMenuElement, new SortCardsView().element, RenderPosition.AFTEREND);
render(siteMainElement, new SectionFilmsView().element, RenderPosition.BEFOREEND);

const sectionFilms = document.querySelector('.films');
const filmsList = siteMainElement.querySelector('.films-list');
const filmsListContainer = siteMainElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(mockCardData.length, CARD_COUNT_PER_STEP); i++) {
  render(
    filmsListContainer,
    new FilmCard(mockCardData[i]).element,
    RenderPosition.BEFOREEND
  );
}

const filmCardElements = filmsListContainer.querySelectorAll('.film-card');

filmCardElements.forEach((element) => {
  render(element, new ButtonsControlFilmCardView().element, RenderPosition.BEFOREEND);
});

render(filmsList, new ButtonShowMoreView().element, RenderPosition.BEFOREEND);
render(sectionFilms, new ContainerTopRaitedFilmView().element, RenderPosition.BEFOREEND);
render(sectionFilms, new ContainerMostCommentedFilmView().element, RenderPosition.BEFOREEND);

const sortButtonsListCard = document.querySelectorAll('.sort__button');
const showMoreButton = document.querySelector('.films-list__show-more');
const filterCardButtonsList = document.querySelectorAll('.film-card__controls-item');
const filmsListExtra = document.querySelector('.films-list--extra');
const filmsCardsTopRaited = filmsListExtra.querySelector('.films-list__container');
const filmsListExtraCommentedContainer = document.querySelector('.most');
const filmsCardsMostComments = filmsListExtraCommentedContainer.querySelector('.films-list__container');

for (let i = 0; i< 2; i++) {
  render(filmsCardsTopRaited, new TopRatedFilmCardView(sortDataByRaitings[i]).element, RenderPosition.AFTERBEGIN);
  render(filmsCardsMostComments, new MostCommentedFilmCardView(sortDataByComments[i]).element, RenderPosition.AFTERBEGIN);
}

render(siteFooterStatistics, new FooterStatisticsView(mockCardData).element, RenderPosition.AFTERBEGIN);
  render(siteFooter, new ContainerPopupView().element, RenderPosition.AFTEREND);
  const popupTopContainer = document.querySelector('.film-details__top-container');
  render(popupTopContainer, new ButtonClosePopupView().element, RenderPosition.AFTERBEGIN);
  const buttonClosePopupWrap = document.querySelector('.film-details__close');
  render(buttonClosePopupWrap, new PopupView(mockCardData[0]).element, RenderPosition.AFTEREND);
  const popupElementWrap = document.querySelector('.film-details__info-wrap');
  render(popupElementWrap, new ButtonsControlPopupView().element, RenderPosition.AFTEREND);
  const commentsList =  document.querySelector('.film-details__comments-list');
  for (let i = 0; i < 5; i++) {
    render(commentsList, new PopupCommentsView(mockCardData[i]).element, RenderPosition.AFTERBEGIN);
  }
  render(commentsList, new PopupNewCommentsView().element, RenderPosition.AFTEREND);
  
const filmCardComponent = new FilmCard(mockCardData[0]);
const ButtonClosePopupComponent = new ButtonClosePopupView();

filmCardComponent.element.querySelector('img').addEventListener('click', () => {

});

ButtonClosePopupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
});

const sortButtonsListPopup = document.querySelectorAll('.film-details__control-button');
sortButtonsListCard.forEach((button) => {
  button.addEventListener('click', (evt) => {
    evt.preventDefault();
    sortButtonsListCard.forEach((element) => {
      element.classList.remove('sort__button--active');
    });
    button.classList.add('sort__button--active');
  });
});

filterCardButtonsList.forEach((button) => {
  button.addEventListener('click', (evt) => {
    evt.preventDefault();
    button.classList.toggle('film-card__controls-item--active');
  });
});

sortButtonsListCard.forEach((button) => {
  button.addEventListener('click', (evt) => {
    evt.preventDefault();
    if(button.classList.contains('sort__button--active') && button === sortButtonsListCard.item(2)) {
      filmsListContainer.innerHTML = '';
      sortDataByRaitings
        .forEach((card) =>  render(
          filmsListContainer,
          new FilmCard(card).element,
          RenderPosition.BEFOREEND
        ));
      showMoreButton.remove();
    }
    else if (button.classList.contains('sort__button--active') && button === sortButtonsListCard.item(1)) {
      filmsListContainer.innerHTML = '';
      sortDataByDate
        .forEach((card) =>  render(
          filmsListContainer,
          new FilmCard(card).element,
          RenderPosition.BEFOREEND
        ));
      showMoreButton.remove();
    }
    else if (button.classList.contains('sort__button--active') && button === sortButtonsListCard.item(0)) {
      filmsListContainer.innerHTML = '';
      for (let i = 0; i < Math.min(mockCardData.length, CARD_COUNT_PER_STEP); i++) {
        render(
          filmsListContainer,
          new FilmCard(mockCardData[i]).element,
          RenderPosition.BEFOREEND
        );
      }
    }
  });
});

showMoreButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  mockCardData
    .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
    .forEach((card) => render(
      filmsListContainer,
      new FilmCard(card).element,
      RenderPosition.BEFOREEND
    ));
  renderedCardCount += CARD_COUNT_PER_STEP;
  if(renderedCardCount >= mockCardData.length) {
    showMoreButton.remove();
  }
});

sortButtonsListPopup.forEach((button) => {
  button.addEventListener('click', (evt) => {
    evt.preventDefault();
    sortButtonsListPopup.forEach((element) => {
      element.classList.remove('film-details__control-button--active');
    });
    button.classList.add('film-details__control-button--active');
  });
});




