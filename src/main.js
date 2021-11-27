import {createSiteMenuTemplate} from './view/site-menu-view.js';
import {createFilmCardSectionTemplate} from './view/container-card-view.js';
import {createFilmCardTemplate} from './view/movie-card-view.js';
import {createUserRankTemplate } from './view/user-rank-view.js';
import {createButtonShowMoreTemplate} from './view/button-showmore-view.js';
import {renderTemplate, RenderPosition} from './render.js';
import { createPopUpTemplate } from './view/popup-view.js';
import { generateFilmCard, generatePopupCard } from './mock/generateCard.js';

const CARD_COUNT = 5;
const MOCK_DATA_COUNT = 20;
const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');

renderTemplate(siteHeader, createUserRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(siteMainElement, createFilmCardSectionTemplate(), RenderPosition.BEFOREEND);

const filmsSection = siteMainElement.querySelector('.films');
const filmsListContainer = siteMainElement.querySelector('.films-list__container');

renderTemplate(filmsSection, createButtonShowMoreTemplate(), RenderPosition.BEFOREEND);

const mockCardData = Array.from({length: MOCK_DATA_COUNT}, generateFilmCard);
const mockPopupData = Array.from({length: MOCK_DATA_COUNT}, generatePopupCard);

/* eslint-disable no-alert, no-console */
console.log(mockCardData);
console.log(mockPopupData);

for (let i = 0; i < CARD_COUNT; i++) {
  renderTemplate(filmsListContainer, createFilmCardTemplate(mockCardData[i]), RenderPosition.BEFOREEND);
}

for (let i = 0; i < CARD_COUNT; i++) {
  renderTemplate(siteFooter, createPopUpTemplate(mockPopupData[i]), RenderPosition.AFTEREND);
}