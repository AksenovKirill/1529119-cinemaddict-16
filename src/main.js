import {createSiteMenuTemplate} from './view/site-menu-view.js';
import {createFilmCardSectionTemplate} from './view/container-card-view.js';
import {createFilmCardTemplate} from './view/movie-card-view.js';
import {createUserRankTemplate } from './view/user-rank-view.js';
import {createButtonShowMoreTemplate} from './view/button-showmore-view.js';
import {renderTemplate, RenderPosition} from './render.js';
/* import { createPopUpTemplate } from './view/popup-view.js'; */
import { generateFilmCard, generatePopupCard } from './mock/generateCard.js';

const CARD_COUNT = 5;
const MOCK_DATE_COUNT = 20;
const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
/* const siteFooter = document.querySelector('.footer'); */

renderTemplate(siteHeader, createUserRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(siteMainElement, createFilmCardSectionTemplate(), RenderPosition.BEFOREEND);

const filmsSection = siteMainElement.querySelector('.films');
const filmsListContainer = siteMainElement.querySelector('.films-list__container');

for (let i = 0; i < CARD_COUNT; i++) {
  renderTemplate(filmsListContainer, createFilmCardTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(filmsSection, createButtonShowMoreTemplate(), RenderPosition.BEFOREEND);
/* renderTemplate(siteFooter, createPopUpTemplate(), RenderPosition.AFTEREND); */
const mockCardDate = Array.from({length: MOCK_DATE_COUNT}, generateFilmCard);
const mockPopupDate = Array.from({length: MOCK_DATE_COUNT}, generatePopupCard);
/* eslint-disable no-alert, no-console */
console.log(mockCardDate);
console.log(mockPopupDate);