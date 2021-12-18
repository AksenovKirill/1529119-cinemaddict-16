import AbstractView from './abstract-view.js';

const createSortButtonsCards = () =>
  `<ul class="sort">
  <li><a href="#" class="sort__button sort__button--active" data-sort-by-type = "default">Sort by default</a></li>
  <li><a href="#" class="sort__button" data-sort-by-type = "date">Sort by date</a></li>
  <li><a href="#" class="sort__button" data-sort-by-type = "rating">Sort by rating</a></li>
</ul>`;

export default class SortButtonsCardsView extends AbstractView {
  get template() {
    return createSortButtonsCards();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

    #clickHandler = (evt) => {
      evt.preventDefault();
      this._callback.click(evt);
      document.querySelector('.sort__button--active').classList.remove('sort__button--active');
      evt.target.classList.add('sort__button--active');
    }
}

