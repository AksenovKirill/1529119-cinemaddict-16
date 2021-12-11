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
import { generateFilter } from './mock/filter.js';

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
export const sortDataByDate = mockCardData.slice().sort((a,b) => b.year - a.year);
const filters = generateFilter(mockCardData);

const siteMenuComponent = new SiteMenuView(filters);
const sectionFilmsComponent = new SectionFilmsView();
const sortButtonsCardsComponent = new SortButtonsCardsView();
const showMoreButtonComponent = new ShowMoreButtonView();
const noFilmCardsComponent = new NoFilmCardView();

let popupComponent;
let cardComponent;
let TopRatedFilmCardComponent;
let MostCommentedFilmCardComponent;

render(
  siteHeader,
  new UserRankView().element,
  RenderPosition.BEFOREEND
);

render(
  siteMainElement,
  siteMenuComponent,
  RenderPosition.AFTERBEGIN
);

const onEscKeyDown = (evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    bodyElement.classList.remove('hide-overflow');
    popupComponent.element.remove(bodyElement);
  }
};

if (mockCardData.length === 0) {
  sectionFilmsComponent.element.innerHTML = '';
  sortButtonsCardsComponent.element.innerHTML = '';

  render(
    siteMenuComponent.element,
    noFilmCardsComponent,
    RenderPosition.AFTEREND
  );
}

const renderPopup = (popupListElement, data) => {
  popupComponent = new PopupView(data);

  render(
    siteFooter,
    popupComponent.element,
    RenderPosition.AFTEREND
  );

  render(
    popupComponent.element
      .querySelector('.film-details__comments-list'),
    new PopupCommentsView(data.comments).element,
    RenderPosition.AFTERBEGIN
  );

  render(
    popupComponent.element
      .querySelector('.film-details__comments-list'),
    new PopupNewCommentsView(data.comments).element,
    RenderPosition.AFTEREND
  );

  render(popupListElement, popupComponent, RenderPosition.AFTEREND);

  popupComponent.setEditClickCloseButtonHandler(() => {
    popupComponent.element.remove(bodyElement);
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onEscKeyDown);
  });

  const sortButtonsPopupList = popupComponent.element.querySelectorAll('.film-details__control-button');

  for (const button of sortButtonsPopupList) {
    button.addEventListener('click', (evt) => {
      evt.preventDefault();
      button.classList.toggle('film-details__control-button--active');
    });
  }
};

document.addEventListener('keydown', onEscKeyDown);

const renderCard = (cardListElement, data) => {
  cardComponent = new FilmCardView(data);
  const filterCardButtonsList = cardComponent.element.querySelector('.film-card__controls').children;

  for (const button of filterCardButtonsList) {
    button.addEventListener('click', (evt) => {
      evt.preventDefault();
      button.classList.toggle('film-card__controls-item--active');
    });
  }

  cardComponent.setEditClickHandler(() => {
    bodyElement.classList.add('hide-overflow');
    renderPopup(siteFooter, data);
  });

  render(cardListElement, cardComponent, RenderPosition.BEFOREEND);
};

render(
  siteMainElement,
  sectionFilmsComponent,
  RenderPosition.BEFOREEND
);

render(
  siteMenuComponent,
  sortButtonsCardsComponent,
  RenderPosition.AFTEREND
);

//отрисовка карточек
for (let i = 0; i < Math.min(mockCardData.length, CARD_COUNT_PER_STEP); i++) {
  renderCard(
    sectionFilmsComponent.element
      .querySelector('.films-list__container'),
    mockCardData[i]);
}

render(
  sectionFilmsComponent.element
    .querySelector('.films-list'),
  showMoreButtonComponent,
  RenderPosition.BEFOREEND
);

showMoreButtonComponent.setEditClickHandler(() => {
  mockCardData
    .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
    .forEach((card) => renderCard(
      sectionFilmsComponent.element.querySelector('.films-list__container'),
      card
    ));
  renderedCardCount += CARD_COUNT_PER_STEP;
  if(renderedCardCount >= mockCardData.length) {
    showMoreButtonComponent.element.remove();
  }
});

//отрисовка карточек после сортировки в секциях ТОП
for (let i = 0; i < 2; i++) {
  TopRatedFilmCardComponent = new TopRatedFilmCardView(sortDataByRaitings[i]);
  render(
    sectionFilmsComponent.element.querySelector('.films-list--extra')
      .querySelector('.films-list__container'),
    TopRatedFilmCardComponent.element,
    RenderPosition.BEFOREEND
  );
  const TopRatedFilmCardList = TopRatedFilmCardComponent.element.querySelector('.film-card__controls').children;
  for (const button of TopRatedFilmCardList) {
    button.addEventListener('click', () => {
      button.classList.toggle('film-card__controls-item--active');
    });
  }
}

for (let i = 0; i < 2; i++) {
  MostCommentedFilmCardComponent = new MostCommentedFilmCardView(sortDataByComments[i]);
  render(
    sectionFilmsComponent.element.querySelector('.films-list--extra:last-child')
      .querySelector('.films-list__container'),
    MostCommentedFilmCardComponent.element,
    RenderPosition.BEFOREEND
  );
  const MostCommentedFilmCardList = MostCommentedFilmCardComponent.element.querySelector('.film-card__controls').children;
  for (const button of MostCommentedFilmCardList) {
    button.addEventListener('click', () => {
      button.classList.toggle('film-card__controls-item--active');
    });
  }
}

render(
  siteFooterStatistics,
  new FooterStatisticsView(mockCardData).element,
  RenderPosition.AFTERBEGIN
);

const sortButtonsListCards = sortButtonsCardsComponent.element.querySelectorAll('.sort__button');

sortButtonsListCards.forEach((button) => {
  button.addEventListener('click', (evt) => {
    evt.preventDefault();
    sortButtonsListCards.forEach((element) => {
      element.classList.remove('sort__button--active');
    });
    button.classList.add('sort__button--active');
  });
});

sortButtonsListCards.forEach((button) => {
  button.addEventListener('click', (evt) => {
    evt.preventDefault();
    if(button.classList.contains('sort__button--active') && button === sortButtonsListCards[2]) {
      sectionFilmsComponent.element.querySelector('.films-list__container').innerHTML = '';
      sortDataByRaitings
        .forEach((card) =>  renderCard(
          sectionFilmsComponent.element.querySelector('.films-list__container'),
          card
        ));
      showMoreButtonComponent.element.remove();
    }
    else if (button.classList.contains('sort__button--active') && button === sortButtonsListCards[1]) {
      sectionFilmsComponent.element.querySelector('.films-list__container').innerHTML = '';
      sortDataByDate
        .forEach((card) =>  renderCard(
          sectionFilmsComponent.element.querySelector('.films-list__container'),
          card
        ));
      showMoreButtonComponent.element.remove();
    }
    else if (button.classList.contains('sort__button--active') && button === sortButtonsListCards[0]) {
      sectionFilmsComponent.element.querySelector('.films-list__container').innerHTML = '';
      for (let i = 0; i < Math.min(mockCardData.length, CARD_COUNT_PER_STEP); i++) {
        renderCard(
          sectionFilmsComponent.element.querySelector('.films-list__container'),
          mockCardData[i]
        );
      }
      sectionFilmsComponent.element.querySelector('.films-list')
        .appendChild(showMoreButtonComponent.element);
    }
  });
});
