import FilmListPresenter from './presenters/film-list-presenter.js';
import FilterPresenter from './presenters/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import {render, RenderPosition, remove} from './utils/render.js';
import {generateFilm} from './mock/generateFilm.js';
import { MenuItem } from './const.js';
import UserRankView from './view/user-rank-view.js';
import FooterView from './view/footer-view.js';
import StatisticView from './view/stat-view.js';


const FILM_COUNT = 39;

const siteHeader = document.querySelector('.header');
export const siteMainElement = document.querySelector('.main');
export const siteFooter = document.querySelector('.footer');
const siteFooterStatistics = siteFooter.querySelector('.footer__statistics');

export const films = Array.from({ length: FILM_COUNT }, generateFilm);
const filmsModel = new FilmsModel();
filmsModel.films = films;
const filterModel = new FilterModel();

render(siteHeader, new UserRankView(filmsModel.films), RenderPosition.BEFOREEND);
render(siteFooterStatistics, new FooterView(films).element, RenderPosition.AFTERBEGIN);

const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

let statisticComponent = null;

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILM:
      remove(statisticComponent);
      filmListPresenter.destroy();
      filterPresenter.destroy();
      filterPresenter.init();
      filmListPresenter.init();
      break;
    case MenuItem.STATISTIC:
      filterPresenter.destroy();
      filmListPresenter.destroy();
      filterPresenter.init();
      statisticComponent = new StatisticView(filmsModel.films);
      render(siteMainElement, statisticComponent, RenderPosition.BEFOREEND);
      break;
  }
};

filterPresenter.setMenuStatisticClickHandler(handleMenuClick);
filterPresenter.init();
filmListPresenter.init();
