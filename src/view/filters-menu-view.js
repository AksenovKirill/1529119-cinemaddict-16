import AbstractView from './abstract-view.js';

const createFilterMenuTemplate = (data) =>
  `<div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${data[1].count}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${data[2].count}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${data[3].count}</span></a>
    </div>`;

export default class filterMenuView extends AbstractView {
    #data = null;

    constructor(data) {
      super();
      this.#data = data;
    }

    get template() {
      return createFilterMenuTemplate(this.#data);
    }
}
