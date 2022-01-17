import FilterView from '../view/filter-view.js';
import { remove, render, RenderPosition, replace } from '../utils/render.js';
import { filmFilters } from '../utils/filter.js';
import { FilterType, UpdateType } from '../const.js';

export default class FilterPresent {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.WATCHLIST,
        count: filmFilters[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        count: filmFilters[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        count: filmFilters[FilterType.FAVORITES](films).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const previous = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (previous === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filterComponent, previous);
    remove(previous);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MINOR, filterType);
  };
}
