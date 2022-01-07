import AbstractView from './abstract-view.js';

const createSortButtonsCards = () =>
  `<ul class="sort">
    <li>
      <a href="#" class="sort__button sort__button--default sort__button--active" data-sort-by-type="default">Sort by default</a>
    </li>
    <li>
      <a href="#" class="sort__button sort__button--date" data-sort-by-type="date">Sort by date</a>
    </li>
    <li>
      <a href="#" class="sort__button sort__button--rating" data-sort-by-type="rating">Sort by rating</a>
    </li>
  </ul>`;

export default class SortButtonsCardsView extends AbstractView {
  get template() {
    return createSortButtonsCards();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.sort__button--default').addEventListener('click', this.#clickHandler);
    this.element.querySelector('.sort__button--date').addEventListener('click', this.#clickHandler);
    this.element.querySelector('.sort__button--rating').addEventListener('click', this.#clickHandler);
  }

    #clickHandler = (evt) => {
      evt.preventDefault();
      this._callback.click(evt);
      this.element.querySelector('.sort__button--active').classList.remove('sort__button--active');
      evt.target.classList.add('sort__button--active');
    }
}

