import AbstractView from './abstract-view.js';

const createSortButtons = () =>
  `<ul class="sort">
    <li>
      <a href="#" class="sort__button sort__button--default sort__button--active" data-sort-type="default">Sort by default</a>
    </li>
    <li>
      <a href="#" class="sort__button sort__button--date" data-sort-type="date">Sort by date</a>
    </li>
    <li>
      <a href="#" class="sort__button sort__button--rating" data-sort-type="rating">Sort by rating</a>
    </li>
  </ul>`;

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortButtons(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this._callback.click = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
    this.element.querySelector('.sort__button--default').addEventListener('click', this.#clickHandler);
    this.element.querySelector('.sort__button--date').addEventListener('click', this.#clickHandler);
    this.element.querySelector('.sort__button--rating').addEventListener('click', this.#clickHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(evt);
    this.element.querySelector('.sort__button--active').classList.remove('sort__button--active');
    evt.target.classList.add('sort__button--active');
  }
}

