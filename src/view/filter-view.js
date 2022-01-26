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
    <a href="#stats" data-menu-type="${MenuItem.STATISTIC}" class="main-navigation__additional
    ${currentFilterType === MenuItem.STATISTIC ? 'main-navigation__additional-active' : ''}">Stats</a>
</nav>`;

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
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

    if (evt.target.dataset.menuType === MenuItem.STATISTIC) {
      this._callback.menuClick(evt.target.dataset.menuType);
    } else {
      this._callback.menuClick(evt.target.dataset.menuType);
      this._callback.filterTypeChange(evt.target.id);
    }
  }
}
