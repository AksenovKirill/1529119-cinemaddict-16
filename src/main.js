import { renderTemplate, RenderPosition } from './render.js';
import { generateFilmCard } from './mock/generateCards.js';
import { createSiteMenuTemplate } from './view/site-menu-view.js';
import { createSectionFilmsTemplate } from './view/container-card-view.js';
import { createFilmCardTemplate } from './view/movie-card-view.js';
import { createUserRankTemplate } from './view/user-rank-view.js';
import { createButtonShowMoreTemplate } from './view/button-showmore-view.js';
import { createPopUpTemplate } from './view/popup-view.js';
import { createPopupCommentsTemplate } from './view/popup-comments-view.js';
import { createAmountCommentsTemplate } from './view/popup-comments-view.js';
import { createContainerFilmTopTemplate } from './view/container-top-rated-view.js';
import { createContainerFilmCommentedTemplate } from './view/container-most-commented-view.js';
import { createTopRatedFilmCardTepmplate } from './view/movie-card-top-rated-view.js';
import { createMostCommentedFilmCardTepmplate } from './view/movie-card-most-commented-view.js';
import { createFooterStatisticsTemplate } from './view/footer-view.js';

const CARD_COUNT_PER_STEP = 5;
const MOCK_DATA_COUNT = 20;

const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');
const siteFooterStatistics = siteFooter.querySelector('.footer__statistics');
const mockCardData = Array.from({ length: MOCK_DATA_COUNT }, generateFilmCard);

renderTemplate(siteHeader, createUserRankTemplate(), RenderPosition.BEFOREEND);

renderTemplate(
  siteMainElement,
  createSiteMenuTemplate(),
  RenderPosition.AFTERBEGIN
);

renderTemplate(
  siteMainElement,
  createSectionFilmsTemplate(),
  RenderPosition.BEFOREEND
);

renderTemplate(
  siteFooterStatistics,
  createFooterStatisticsTemplate(mockCardData),
  RenderPosition.AFTERBEGIN
);

const sectionFilms = document.querySelector('.films');
const filmsList = siteMainElement.querySelector('.films-list');
const filmsListContainer = siteMainElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(mockCardData.length, CARD_COUNT_PER_STEP); i++) {
  renderTemplate(
    filmsListContainer,
    createFilmCardTemplate(mockCardData[i]),
    RenderPosition.BEFOREEND
  );
}

if(mockCardData.length > CARD_COUNT_PER_STEP) {
  let renderedCardCount = CARD_COUNT_PER_STEP;
  renderTemplate(
    filmsList,
    createButtonShowMoreTemplate(),
    RenderPosition.BEFOREEND
  );
  const showButton = document.querySelector('.films-list__show-more');
  showButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    mockCardData
      .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
      .forEach((card) =>  renderTemplate(
        filmsListContainer,
        createFilmCardTemplate(card),
        RenderPosition.BEFOREEND
      ));
    renderedCardCount += CARD_COUNT_PER_STEP;
    if(renderedCardCount >= mockCardData.length) {
      showButton.remove();
    }
  });
}

renderTemplate(
  sectionFilms,
  createContainerFilmTopTemplate(mockCardData),
  RenderPosition.BEFOREEND
);

renderTemplate(
  sectionFilms,
  createContainerFilmCommentedTemplate(mockCardData),
  RenderPosition.BEFOREEND
);

const filmsListExtra = document.querySelector('.films-list--extra');
const filmsListExtraContainer = filmsListExtra.querySelector('div');
const filmsListExtraCommentedContainer = document.querySelector('.most');
const filmsCardsTopComments = filmsListExtraCommentedContainer.querySelector(
  '.films-list__container'
);

renderTemplate(
  filmsListExtraContainer,
  createTopRatedFilmCardTepmplate(mockCardData),
  RenderPosition.AFTERBEGIN
);

renderTemplate(
  filmsCardsTopComments,
  createMostCommentedFilmCardTepmplate(mockCardData),
  RenderPosition.AFTERBEGIN
);

renderTemplate(
  siteFooter,
  createPopUpTemplate(mockCardData.shift()),
  RenderPosition.AFTEREND
);

const popUpCommentsContainer = document.querySelector('.film-details__comments-list');
const sectionCommentsDetails = document.querySelector('.film-details__comments-wrap');

renderTemplate(
  popUpCommentsContainer,
  createPopupCommentsTemplate(mockCardData.shift()),
  RenderPosition.AFTERBEGIN
);

renderTemplate(
  sectionCommentsDetails,
  createAmountCommentsTemplate(mockCardData.shift()),
  RenderPosition.BEFOREBEGIN
);
