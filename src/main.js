import FooterStatisticsView from './view/footer-statistics-view.js';
import {render, RenderPosition} from './utils/render.js';
import {generateFilm} from './mock/generateFilm.js';
import FilmListPresenter from './presenters/film-list-presenter.js';
import FilterPresent from './presenters/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';

const FILM_COUNT = 29;

const siteMainElement = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');
const siteFooterStatistics = siteFooter.querySelector('.footer__statistics');

export const films = Array.from({ length: FILM_COUNT }, generateFilm);

const filmsModel = new FilmsModel();
filmsModel.films = films;

const filterModel = new FilterModel();

const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel, filterModel);
const filterPresent = new FilterPresent(siteMainElement, filterModel, filmsModel);


const footerStaticsComponent = new FooterStatisticsView(films).element;

render(siteFooterStatistics, footerStaticsComponent, RenderPosition.AFTERBEGIN);

filterPresent.init();
filmListPresenter.init();
