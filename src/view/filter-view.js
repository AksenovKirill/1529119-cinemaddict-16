import AbstractView from './abstract-view.js';
import { FilterType, MenuItem } from '../const.js';

export const createFilterTemplate = (filter, currentFilterType) => `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" id="${FilterType.ALL_MOVIES}"
      class="main-navigation__item ${currentFilterType === FilterType.ALL_MOVIES ? 'main-navigation__item--active' : ''}"
      data-menu-type="${MenuItem.FILM}">
      All movies</a>
    <a href="#watchlist" id="${FilterType.WATCHLIST}"
      class="main-navigation__item ${currentFilterType === FilterType.WATCHLIST ? 'main-navigation__item--active' : ''}"
      data-menu-type="${MenuItem.FILM}">
      Watchlist
      <span class="main-navigation__item-count">${filter[FilterType.WATCHLIST]}</span>
    </a>
    <a href="#history" id="${FilterType.HISTORY}"
      class="main-navigation__item ${currentFilterType === FilterType.HISTORY ? 'main-navigation__item--active' : ''}"
      data-menu-type="${MenuItem.FILM}">
      History
      <span class="main-navigation__item-count">${filter[FilterType.HISTORY]}</span>
    </a>
    <a href="#favorites" id="${FilterType.FAVORITES}"
      class="main-navigation__item ${currentFilterType === FilterType.FAVORITES ? 'main-navigation__item--active' : ''}"
      data-menu-type="${MenuItem.FILM}">
      Favorites
      <span class="main-navigation__item-count">${filter[FilterType.FAVORITES]}</span>
    </a>
  </div>
    <a href="#stats" id="${FilterType.STATISTICS}" data-menu-type="${MenuItem.STATISTICS}" class="main-navigation__additional
    ${currentFilterType === FilterType.STATISTICS ? 'main-navigation__additional--active' : ''}">Stats</a>
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

  setStatisticsClickHandler = (callback) => {
    this._callback.menuClick = callback;
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    this._callback.menuClick(evt.target.dataset.menuType);
    this._callback.filterTypeChange(evt.target.id);
  }
}

