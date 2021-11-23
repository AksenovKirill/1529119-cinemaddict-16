import {createSiteMenuTemplate} from './view/site-menu-view.js';
import {createFilmCardTemplate} from './view/container-card-view.js';
import {createFilmCard} from './view/movie-card-view.js';
import {createUserRankTemplate } from './view/user-rank-view.js';
import {createButtonShowMoreTemplate} from './view/button-showmore-view.js';
import {renderTemplate, RenderPosition} from './render.js';
import { createPopUpTemplate } from './view/popup-view.js';

const CARD_COUNT = 5;
const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');
renderTemplate(siteHeader, createUserRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(siteMainElement, createFilmCardTemplate(), RenderPosition.BEFOREEND);

const filmsSection = siteMainElement.querySelector('.films');
const filmsListContainer = siteMainElement.querySelector('.films-list__container');

for (let i = 0; i < CARD_COUNT; i++) {
  renderTemplate(filmsListContainer, createFilmCard(), RenderPosition.BEFOREEND);
}

renderTemplate(filmsSection, createButtonShowMoreTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteFooter, createPopUpTemplate(), RenderPosition.AFTEREND);
