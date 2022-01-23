import AbstractView from './abstract-view.js';
import { FilterType } from '../const.js';

export const createFilterTemplate = (filter, currentFilterType) => `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all"
      class="main-navigation__item ${currentFilterType === FilterType.ALL_MOVIES ? 'main-navigation__item--active' : ''}"
      data-type="${FilterType.ALL_MOVIES}">
      All movies</a>
    <a href="#watchlist"
      class="main-navigation__item ${currentFilterType === FilterType.WATCHLIST ? 'main-navigation__item--active' : ''}"
      data-type="${FilterType.WATCHLIST}">
      Watchlist
      <span class="main-navigation__item-count">${filter[FilterType.WATCHLIST]}</span>
    </a>
    <a href="#history"
      class="main-navigation__item ${currentFilterType === FilterType.HISTORY ? 'main-navigation__item--active' : ''}"
      data-type="${FilterType.HISTORY}">
      History
      <span class="main-navigation__item-count">${filter[FilterType.HISTORY]}</span>
    </a>
    <a href="#favorites"
      class="main-navigation__item ${currentFilterType === FilterType.FAVORITES ? 'main-navigation__item--active' : ''}"
      data-type="${FilterType.FAVORITES}">
      Favorites
      <span class="main-navigation__item-count">${filter[FilterType.FAVORITES]}</span>
    </a>
  </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    if(evt.target.dataset.type) {
      this._callback.filterTypeChange(evt.target.dataset.type);
    }
  }
}
