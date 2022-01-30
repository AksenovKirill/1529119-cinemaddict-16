import FooterView from './view/footer-view.js';
import StatisticView from './view/stat-view.js';
import FilmListPresenter from './presenters/film-list-presenter.js';
import FilterPresenter from './presenters/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import {render, RenderPosition, remove} from './utils/render.js';
import { MenuItem, END_POINT, AUTHORIZATION } from './const.js';
import ApiService from './api-server.js';

export const siteMainElement = document.querySelector('.main');
export const siteFooter = document.querySelector('.footer');
const siteFooterStatistics = siteFooter.querySelector('.footer__statistics');

const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

filmsModel.addObserver(() => {
  render(siteFooterStatistics, new FooterView(filmsModel.films), RenderPosition.AFTERBEGIN);
});

const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

let statisticComponent = null;
const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILM:
      remove(statisticComponent);
      filmListPresenter.destroy();
      filmListPresenter.init();
      break;
    case MenuItem.STATISTICS:
      filmListPresenter.destroy();
      statisticComponent = new StatisticView(filmsModel.films);
      render(siteMainElement, statisticComponent, RenderPosition.BEFOREEND);
      break;
  }
};

filterPresenter.init();
filmListPresenter.init();
filmsModel.init();
filterPresenter.setMenuStatisticClickHandler(handleMenuClick);
