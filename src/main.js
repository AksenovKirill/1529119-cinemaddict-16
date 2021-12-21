import SiteMenuView from './view/site-menu-view.js';
import filterMenuView from './view/filters-menu-view.js';
import FooterStatisticsView from './view/footer-statistics-view.js';
import {render, RenderPosition} from './render.js';
import {generateFilmCard} from './mock/generateCards.js';
import { generateFilter } from './utils.js';
import FilmListPresenter from './presenters/film-list-presenter.js';

const MOCK_DATA_COUNT = 20;
const siteMainElement = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');
const siteFooterStatistics = siteFooter.querySelector('.footer__statistics');


const mockData = Array.from({ length: MOCK_DATA_COUNT }, generateFilmCard);
const filters = generateFilter(mockData);
const footerStaticsComponent = new FooterStatisticsView(mockData).element;


const filmListPresenter = new FilmListPresenter(siteMainElement);
const siteMenuComponent = new SiteMenuView();
const filterMenuComponent = new filterMenuView(filters);

render(siteMainElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
render(siteMenuComponent, filterMenuComponent, RenderPosition.AFTERBEGIN);
render(siteFooterStatistics, footerStaticsComponent,RenderPosition.AFTERBEGIN);

filmListPresenter.init(mockData);
