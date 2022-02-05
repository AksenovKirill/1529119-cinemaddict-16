import StatisticView from './view/statistics-view.js';
import FilmListPresenter from './presenters/film-list-presenter.js';
import FilterPresenter from './presenters/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import {render, remove} from './utils/render.js';
import { MenuItem, END_POINT, AUTHORIZATION, RenderPosition } from './const.js';
import ApiServer from './api-server.js';

export const siteMainElement = document.querySelector('.main');

const filmsModel = new FilmsModel(new ApiServer(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();


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
