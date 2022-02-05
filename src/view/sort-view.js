import AbstractView from './abstract-view.js';
import { SortType } from '../const.js';

const createSortTemplate = (currentSortType) => {

  const getSortTemplate = (sortType) => (
    `<li><a href="#" class="sort__button ${currentSortType === sortType ? 'sort__button--active' : ''}" data-sort-type="${sortType}">Sort by ${sortType}</a></li>`
  );

  const sortValues = Object.values(SortType);

  const sortTemplate = sortValues.map((value) => getSortTemplate(value)).join('');

  return (
    `<ul class="sort">
      ${sortTemplate}
    </ul>`
  );
};

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();

    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();

    this._callback.sortTypeChange(evt.target.dataset.sortType);
    this.#renderActiveSortType(evt.target);
  }

  #renderActiveSortType = (sortButton) => {
    this.element.querySelectorAll('.sort__button').forEach((button) => {
      if (button.classList.contains('sort__button--active')) {
        button.classList.remove('sort__button--active');
      }
    });
    sortButton.classList.add('sort__button--active');
  };
}

