import SiteMenuView from './view/site-menu-view.js';
import filterMenuView from './view/filters-menu-view.js';
import FooterStatisticsView from './view/footer-statistics-view.js';
import {render, RenderPosition} from './utils/render.js';
import {generateFilm} from './mock/generateFilm.js';
import { generateFilter } from './utils/filter.js';
import FilmListPresenter from './presenters/film-list-presenter.js';
import FilmsModel from './model/films-model.js';


const FILM_COUNT = 24;

const siteMainElement = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');
const siteFooterStatistics = siteFooter.querySelector('.footer__statistics');

export const films = Array.from({ length: FILM_COUNT }, generateFilm);
const filters = generateFilter(films);

const filmsModel = new FilmsModel();
filmsModel.films = films;

const footerStaticsComponent = new FooterStatisticsView(films).element;

const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel);

const siteMenuComponent = new SiteMenuView();
const filterMenuComponent = new filterMenuView(filters);

render(siteMainElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
render(siteMenuComponent, filterMenuComponent, RenderPosition.AFTERBEGIN);
render(siteFooterStatistics, footerStaticsComponent, RenderPosition.AFTERBEGIN);

filmListPresenter.init();
