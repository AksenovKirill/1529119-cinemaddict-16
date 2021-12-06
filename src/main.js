import UserRankView from './view/user-rank-view.js';
import SiteMenuView from './view/site-menu-view.js';
import SortCardsView from './view/sort-cards-view.js';
import SectionFilmsView from './view/container-card-view.js';
import FilmCardView from './view/movie-card-view.js';
import ButtonShowMoreView from './view/button-showmore-view.js';
import ContainerTopRaitedFilmView from './view/container-top-rated-view.js';
import ContainerMostCommentedFilmView from './view/container-most-commented-view';
import TopRatedFilmCardView from './view/movie-card-top-rated-view.js';
import MostCommentedFilmCardView from './view/movie-card-most-commented-view.js';
import FooterStatisticsView from './view/footer-statistics-view.js';
import ContainerPopupView  from './view/container-popup-view.js';
import PopupView from './view/popup-view.js';
import PopupCommentsView from './view/popup-comments-view.js';
import PopupNewCommentsView from './view/popup-new-comments-view.js';
import AmountCommentsView from './view/popup-amount-comments-view.js';
import {render, RenderPosition} from './render.js';
import {generateFilmCard} from './mock/generateCards.js';

const CARD_COUNT_PER_STEP = 5;
const MOCK_DATA_COUNT = 20;

const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');
const siteFooterStatistics = siteFooter.querySelector('.footer__statistics');

let renderedCardCount = CARD_COUNT_PER_STEP;

const mockCardData = Array.from({ length: MOCK_DATA_COUNT }, generateFilmCard);
export const sortDataByRaitings = mockCardData.slice().sort((a,b) => b.raiting - a.raiting);
export const sortDataByComments = mockCardData.slice().sort((a,b) => b.comments.length - a.comments.length);
export const sortDataByDate = mockCardData.slice().sort((a,b) => b.year - a.year);

//отрисовка значка юзер
render(
  siteHeader,
  new UserRankView().element,
  RenderPosition.BEFOREEND
);

const siteMenuComponent = new SiteMenuView();

//отрисовка меню
render(
  siteMainElement,
  siteMenuComponent.element,
  RenderPosition.AFTERBEGIN
);

//отрисовка кнопок сортировки
render(
  siteMenuComponent.element,
  new SortCardsView().element,
  RenderPosition.AFTEREND
);

const sectionFilmsComponent = new SectionFilmsView();

//отрисовка секции для карточек с фильмами
render(
  siteMainElement,
  sectionFilmsComponent.element,
  RenderPosition.BEFOREEND
);

//отрисовка карточек с фильмами
for (let i = 0; i < Math.min(mockCardData.length, CARD_COUNT_PER_STEP); i++) {
  render(
    sectionFilmsComponent.element.querySelector('.films-list__container'),
    new FilmCardView(mockCardData[i]).element,
    RenderPosition.BEFOREEND
  );
}

//отрисовка кнопки Show more
render(
  sectionFilmsComponent.element.querySelector('.films-list'),
  new ButtonShowMoreView().element,
  RenderPosition.BEFOREEND
);

const containerTopRaitedComponent = new ContainerTopRaitedFilmView();

//отрисовка секции с топовыми фильмами
render(
  sectionFilmsComponent.element,
  containerTopRaitedComponent.element,
  RenderPosition.BEFOREEND
);

const containerMostCommentedComponent = new ContainerMostCommentedFilmView();

//отрисовка секции с комментируемыми фильмами
render(
  sectionFilmsComponent.element,
  containerMostCommentedComponent.element,
  RenderPosition.BEFOREEND
);

//отрисовка карточек после сортировки в секциях ТОП
for (let i = 0; i< 2; i++) {
  render(
    containerTopRaitedComponent.element.querySelector('.films-list__container'),
    new TopRatedFilmCardView(sortDataByRaitings[i]).element,
    RenderPosition.BEFOREEND
  );
  render(
    containerMostCommentedComponent.element.querySelector('.films-list__container'),
    new MostCommentedFilmCardView(sortDataByComments[i]).element,
    RenderPosition.BEFOREEND
  );
}

//отрисовка стастистики в footer
render(
  siteFooterStatistics,
  new FooterStatisticsView(mockCardData).element,
  RenderPosition.AFTERBEGIN
);

const createPopup = () => {
  const containerPopupComponent = new ContainerPopupView();

  //отрисовка контейнера для popup
  render(
    siteFooter,
    containerPopupComponent.element,
    RenderPosition.AFTEREND
  );

  const popupComponent = new PopupView((mockCardData[0]));

  //отрисовка popup
  render(
    containerPopupComponent.element.querySelector('.film-details__controls'),
    popupComponent.element,
    RenderPosition.BEFOREBEGIN
  );

  //отрисовка колличества комментариев
  render(
    containerPopupComponent.element.querySelector('.film-details__comments-list'),
    new AmountCommentsView(mockCardData.shift()).element,
    RenderPosition.BEFOREBEGIN
  );

  //отрисовка комментариев
  render(
    containerPopupComponent.element.querySelector('.film-details__comments-list'),
    new PopupCommentsView(mockCardData.shift().comments).element,
    RenderPosition.AFTERBEGIN
  );

  //отрисовка окна для нового комментария
  render(
    containerPopupComponent.element.querySelector('.film-details__comments-list'),
    new PopupNewCommentsView().element,
    RenderPosition.AFTEREND
  );
};


const filmCards = sectionFilmsComponent.element.querySelector('.films-list').querySelectorAll('.film-card');
filmCards.forEach((card) => {
  card.addEventListener('click', createPopup);
});

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
        .forEach((card) =>  render(
          sectionFilmsComponent.element.querySelector('.films-list__container'),
          new FilmCardView(card).element,
          RenderPosition.BEFOREEND
        ));
      showMoreButton.remove();
    }
    else if (button.classList.contains('sort__button--active') && button === sortButtonsListCard.item(1)) {
      sectionFilmsComponent.element.querySelector('.films-list__container').innerHTML = '';
      sortDataByDate
        .forEach((card) =>  render(
          sectionFilmsComponent.element.querySelector('.films-list__container'),
          new FilmCardView(card).element,
          RenderPosition.BEFOREEND
        ));
      showMoreButton.remove();
    }
    else if (button.classList.contains('sort__button--active') && button === sortButtonsListCard.item(0)) {
      sectionFilmsComponent.element.querySelector('.films-list__container').innerHTML = '';
      for (let i = 0; i < Math.min(mockCardData.length, CARD_COUNT_PER_STEP); i++) {
        render(
          sectionFilmsComponent.element.querySelector('.films-list__container'),
          new FilmCardView(mockCardData[i]).element,
          RenderPosition.BEFOREEND
        );
      }
      sectionFilmsComponent.element.querySelector('.films-list').appendChild(showMoreButton);
    }
  });
});

showMoreButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  mockCardData
    .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
    .forEach((card) => render(
      sectionFilmsComponent.element.querySelector('.films-list__container'),
      new FilmCardView(card).element,
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
