import AbstractView from './abstract-view.js';

const createFilterTemplate = () => {
  const {type, count} = filter;

  return `<div class="main-navigation__items">
  <a href="#all" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" main-navigation__item--active">All movies</a>
  <a href="#watchlist" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">Watchlist
    <span class="main-navigation__item-count">${count}</span>
  </a>
  <a href="#history" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">History
    <span class="main-navigation__item-count">${count}</span>
  </a>
  <a href="#favorites" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">Favorites
    <span class="main-navigation__item-count">${count}</span>
  </a>
</div>`
}


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
      this._callback.clickFilterItem = callback;
      this.element.addEventListener('change', this.#filterTypeChangeHandler);
    }

    #filterTypeChangeHandler = (evt) => {
      evt.preventDefault();
      this._callback.filterTypeChange(evt.target.value);
    }
}
