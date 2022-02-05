import FilterView from '../view/filter-view.js';
import { remove, render, replace } from '../utils/render.js';
import { filter } from '../utils/filter.js';
import { FilterType, RenderPosition, UpdateType } from '../const.js';

export default class FilterPresent {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;
  #filterComponent = null;
  #menuClickCallback;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
  }

  get filters() {
    const films = [...this.#filmsModel.films];

    return {
      [FilterType.WATCHLIST]: filter[FilterType.WATCHLIST](films).length,
      [FilterType.HISTORY]: filter[FilterType.HISTORY](films).length,
      [FilterType.FAVORITES]: filter[FilterType.FAVORITES](films).length,
      [FilterType.STATISTICS]: filter[FilterType.STATISTICS](films),
    };
  }

  init = () => {
    const filters = this.filters;
    const previous = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
    this.#filterComponent.setStatisticsClickHandler(this.#menuClickCallback);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    if (previous === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filterComponent, previous);
    remove(previous);
  };

  destroy = () => {
    remove(this.#filterComponent);
    this.#filterComponent = null;

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);

    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL_MOVIES);
  }

  #handleModelEvent = () => {
    this.init();
  };

  setMenuStatisticClickHandler = (callback) => {
    this.#menuClickCallback = callback;
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
