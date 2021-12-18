import UserRankView from './view/user-rank-view.js';
import SiteMenuView from './view/site-menu-view.js';
import SortButtonsCardsView from './view/sort-cards-view.js';
import SectionFilmsView from './view/container-card-view.js';
import FilmCardView from './view/movie-card-view.js';
import ShowMoreButtonView from './view/button-showmore-view.js';
import TopRatedFilmCardView from './view/movie-card-top-rated-view.js';
import MostCommentedFilmCardView from './view/movie-card-most-commented-view.js';
import FooterStatisticsView from './view/footer-statistics-view.js';
import NoFilmCardView from './view/no-filmcard-view.js';
import PopupView from './view/popup-view.js';
import PopupCommentsView from './view/popup-comments-view.js';
import PopupNewCommentsView from './view/popup-new-comments-view.js';
import {render, RenderPosition} from './render.js';
import {generateFilmCard} from './mock/generateCards.js';
import { generateFilter, sortCards } from './utils.js';

const CARD_COUNT_PER_STEP = 5;
const MOCK_DATA_COUNT = 20;

const bodyElement =  document.querySelector('body');
const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');
const siteFooterStatistics = siteFooter.querySelector('.footer__statistics');

let renderedCardCount = CARD_COUNT_PER_STEP;

const mockCardData = Array.from({ length: MOCK_DATA_COUNT }, generateFilmCard);

export const sortDataByRaitings = mockCardData.slice().sort((a,b) => b.raiting - a.raiting);
export const sortDataByComments = mockCardData.slice().sort((a,b) => b.comments.length - a.comments.length);

const filters = generateFilter(mockCardData);

const userRankComponent = new UserRankView().element;
const siteMenuComponent = new SiteMenuView(filters);
const sectionFilmsComponent = new SectionFilmsView().element;
const sortButtonsCardsComponent = new SortButtonsCardsView();
const showMoreButtonComponent = new ShowMoreButtonView();
const noFilmCardsComponent = new NoFilmCardView();
const footerStaticsComponent = new FooterStatisticsView(mockCardData).element;
const filmsListContainer = sectionFilmsComponent.querySelector('.films-list__container');
const filmsList = sectionFilmsComponent.querySelector('.films-list');
const filmsListTopRated = sectionFilmsComponent.querySelector('.films-list--extra').querySelector('.films-list__container');
const filmsListMostCommented = sectionFilmsComponent.querySelector('.films-list--extra:last-child')
  .querySelector('films-list__container');

let popupComponent;
let cardComponent;

render(siteHeader, userRankComponent, RenderPosition.BEFOREEND);

render(siteMainElement, siteMenuComponent, RenderPosition.AFTERBEGIN);

const onEscKeyDown = (evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    bodyElement.classList.remove('hide-overflow');
    popupComponent.element.remove(bodyElement);
  }
};

if (mockCardData.length === 0) {
  sectionFilmsComponent.innerHTML = '';
  sortButtonsCardsComponent.innerHTML = '';

  render(siteMenuComponent.element, noFilmCardsComponent, RenderPosition.AFTEREND);
}

const renderPopup = (popupListElement, data) => {
  popupComponent = new PopupView(data);
  const popupListContainer = popupComponent.element.querySelector('.film-details__comments-list');
  const popupComments = new PopupCommentsView(data.comments);
  const popupNewComments = new PopupNewCommentsView(data.comments);

  render(siteFooter, popupComponent.element, RenderPosition.AFTEREND);

  render(popupListContainer, popupComments.element, RenderPosition.AFTERBEGIN);

  render(popupListContainer, popupNewComments.element, RenderPosition.AFTEREND);

  render(popupListElement, popupComponent, RenderPosition.AFTEREND);

  popupComponent.setEditClickCloseButtonHandler(() => {
    popupComponent.element.remove(bodyElement);
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onEscKeyDown);
  });
};

document.addEventListener('keydown', onEscKeyDown);

const renderCard = (cardListElement, data) => {
  cardComponent = new FilmCardView(data);

  cardComponent.setEditClickHandler();

  cardComponent.setEditClickHandler(() => {
    bodyElement.classList.add('hide-overflow');
    renderPopup(siteFooter, data);
  });

  render(cardListElement, cardComponent, RenderPosition.BEFOREEND);
};

render(siteMainElement,sectionFilmsComponent,RenderPosition.BEFOREEND);

render(siteMenuComponent,sortButtonsCardsComponent,RenderPosition.AFTEREND);

//отрисовка карточек
for (let i = 0; i < Math.min(mockCardData.length, CARD_COUNT_PER_STEP); i++) {
  renderCard(filmsListContainer,mockCardData[i]);
}

render(filmsList, showMoreButtonComponent, RenderPosition.BEFOREEND);

for (let i = 0; i < 2; i++) {
  const topRatedFilmCardComponent = new TopRatedFilmCardView(sortDataByRaitings[i]);
  render( filmsListTopRated, topRatedFilmCardComponent.element, RenderPosition.BEFOREEND);
}

for (let i = 0; i < 2; i++) {
  const mostCommentedFilmCardComponent = new MostCommentedFilmCardView(sortDataByComments[i]);
  render(filmsListMostCommented, mostCommentedFilmCardComponent.element, RenderPosition.BEFOREEND);
}

showMoreButtonComponent.setEditClickHandler(() => {
  mockCardData
    .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
    .forEach((card) => renderCard(filmsListContainer,card));
  renderedCardCount += CARD_COUNT_PER_STEP;
  if(renderedCardCount >= mockCardData.length) {
    showMoreButtonComponent.element.remove();
  }
});

render(siteFooterStatistics, footerStaticsComponent,RenderPosition.AFTERBEGIN);

sortButtonsCardsComponent.setClickHandler((evt) => {
  filmsListContainer.innerHTML = '';
  sortCards(mockCardData, evt.target.dataset.sortByType).slice(0,5).forEach((card) => {
    renderCard(filmsListContainer, card);
  });
});
