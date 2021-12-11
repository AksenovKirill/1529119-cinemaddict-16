import AbstractView from './abstract-view.js';

const createSortButtonsCards = () =>
  `<ul class="sort">
  <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
  <li><a href="#" class="sort__button">Sort by date</a></li>
  <li><a href="#" class="sort__button">Sort by rating</a></li>
</ul>`;

export default class SortButtonsCardsView extends AbstractView {
  get template() {
    return createSortButtonsCards();
  }

  setEditClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

    #clickHandler = (evt) => {
      evt.preventDefault();
      this._callback.click();
    }
}

