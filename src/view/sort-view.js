import AbstractView from './abstract-view.js';
import { SortType } from '../const.js';

const createSortButtons = (currentSortType) =>
  `<ul class="sort">
    <li>
      <a href="#"
      class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}"
      data-type="${SortType.DEFAULT}">
      Sort by default</a>
    </li>
    <li>
      <a href="#"
      class="sort__button ${currentSortType === SortType.DATE ? 'sort__button--active' : ''}"
      data-type="${SortType.DATE}">
      Sort by date</a>
    </li>
    <li>
      <a href="#"
      class="sort__button ${currentSortType === SortType.RATING ? 'sort__button--active' : ''}"
      data-type="${SortType.RATING}">
      Sort by rating</a>
    </li>
  </ul>`;

export default class SortView extends AbstractView {
  #currentSort = null;

  constructor(sort, currentSortType) {
    super();
    this.#currentSort = currentSortType;
  }

  get template() {
    return createSortButtons(this.#currentSort);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if(evt.target.dataset.type) {
      this._callback.sortTypeChange(evt.target.dataset.type);
    }
  }
}

