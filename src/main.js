import UserRankView from './view/user-rank-view.js';
import SiteMenuView from './view/site-menu-view.js';
import SortCardsView from './view/sort-cards-view.js';
import SectionFilmsView from './view/container-card-view.js';
import FilmCardView from './view/movie-card-view.js';
import ButtonShowMoreView from './view/button-showmore-view.js';
import TopRatedFilmCardView from './view/movie-card-top-rated-view.js';
import MostCommentedFilmCardView from './view/movie-card-most-commented-view.js';
import FooterStatisticsView from './view/footer-statistics-view.js';
import NoFilmCardView from './view/no-filmcard-view.js';
import PopupView from './view/popup-view.js';
import PopupCommentsView from './view/popup-comments-view.js';
import PopupNewCommentsView from './view/popup-new-comments-view.js';
import {render, RenderPosition} from './render.js';
import {generateFilmCard} from './mock/generateCards.js';

const CARD_COUNT_PER_STEP = 5;
const MOCK_DATA_COUNT = 40;

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

const siteMenuComponent = new SiteMenuView();
const sectionFilmsComponent = new SectionFilmsView();
const sortCardsComponent = new SortCardsView();
let popupComponent;

render(
  siteHeader,
  new UserRankView().element,
  RenderPosition.BEFOREEND
);

render(
  siteMainElement,
  siteMenuComponent.element,
  RenderPosition.AFTERBEGIN
);

if (mockCardData.length === 0) {
  sectionFilmsComponent.element.innerHTML = '';
  sortCardsComponent.element.innerHTML = '';
  render(
    siteMenuComponent.element,
    new NoFilmCardView().element,
    RenderPosition.AFTEREND);
}

const deletePopup = () => {
  popupComponent.element.remove(siteMainElement);
};

const onEscKeyDown = (evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    deletePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  }
};

const renderPopup = (popupListElement, data) => {
  popupComponent = new PopupView(data);

  popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
    deletePopup();
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(popupListElement, popupComponent.element, RenderPosition.AFTEREND);
};

document.addEventListener('keydown', () => {
  deletePopup();
  bodyElement.classList.remove('hide-overflow');
});

const renderCard = (cardListElement, data) => {
  const cardComponent = new FilmCardView(data);
  cardComponent.element.addEventListener('click', () => {
    bodyElement.classList.add('hide-overflow');
    renderPopup(siteFooter,mockCardData.shift());

    render(
      popupComponent.element
        .querySelector('.film-details__comments-list'),
      new PopupCommentsView(mockCardData.shift().comments).element,
      RenderPosition.AFTERBEGIN
    );

    render(
      popupComponent.element
        .querySelector('.film-details__comments-list'),
      new PopupNewCommentsView().element,
      RenderPosition.AFTEREND
    );
    siteMainElement.appendChild(popupComponent.element);
  });

  render(cardListElement, cardComponent.element, RenderPosition.BEFOREEND);
};

render(
  siteMainElement,
  sectionFilmsComponent.element,
  RenderPosition.BEFOREEND
);

render(
  siteMenuComponent.element,
  sortCardsComponent.element,
  RenderPosition.AFTEREND
);


for (let i = 0; i < Math.min(mockCardData.length, CARD_COUNT_PER_STEP); i++) {
  renderCard(
    sectionFilmsComponent.element
      .querySelector('.films-list__container'),
    mockCardData[i]);
}

render(
  sectionFilmsComponent.element
    .querySelector('.films-list'),
  new ButtonShowMoreView().element,
  RenderPosition.BEFOREEND
);

//отрисовка карточек после сортировки в секциях ТОП
for (let i = 0; i < 2; i++) {
  render(
    sectionFilmsComponent.element.querySelector('.films-list--extra')
      .querySelector('.films-list__container'),
    new TopRatedFilmCardView(sortDataByRaitings[i]).element,
    RenderPosition.BEFOREEND
  );
}
for (let i = 0; i < 2; i++) {
  render(
    sectionFilmsComponent.element.querySelector('.films-list--extra:last-child')
      .querySelector('.films-list__container'),
    new MostCommentedFilmCardView(sortDataByComments[0]).element,
    RenderPosition.BEFOREEND
  );
}
//отрисовка стастистики в footer
render(
  siteFooterStatistics,
  new FooterStatisticsView(mockCardData).element,
  RenderPosition.AFTERBEGIN
);

const sortButtonsListCard = document.querySelectorAll('.sort__button');
const showMoreButton = document.querySelector('.films-list__show-more');
const filterCardButtonsList = document.querySelectorAll('.film-card__controls-item');
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
      sectionFilmsComponent.element.querySelector('.films-list__container').innerHTML = '';
      sortDataByRaitings
        .forEach((card) =>  renderCard(
          sectionFilmsComponent.element.querySelector('.films-list__container'),
          card
        ));
      showMoreButton.remove();
    }
    else if (button.classList.contains('sort__button--active') && button === sortButtonsListCard.item(1)) {
      sectionFilmsComponent.element.querySelector('.films-list__container').innerHTML = '';
      sortDataByDate
        .forEach((card) =>  renderCard(
          sectionFilmsComponent.element.querySelector('.films-list__container'),
          card
        ));
      showMoreButton.remove();
    }
    else if (button.classList.contains('sort__button--active') && button === sortButtonsListCard.item(0)) {
      sectionFilmsComponent.element.querySelector('.films-list__container').innerHTML = '';
      for (let i = 0; i < Math.min(mockCardData.length, CARD_COUNT_PER_STEP); i++) {
        renderCard(
          sectionFilmsComponent.element.querySelector('.films-list__container'),
          mockCardData[i]
        );
      }
      sectionFilmsComponent.element.querySelector('.films-list')
        .appendChild(showMoreButton);
    }
  });
});

showMoreButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  mockCardData
    .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
    .forEach((card) => renderCard(
      sectionFilmsComponent.element.querySelector('.films-list__container'),
      card
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
