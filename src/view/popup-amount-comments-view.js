import { createElement } from '../render.js';

const createAmountCommentsTemplate = (data) => (
  `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">
  ${data.comments.length}</span></h3>`
);

export default class AmountCommentsView {
  #element = null;
  #data = null;

  constructor(data) {
    this.#data = data;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createAmountCommentsTemplate(this.#data);
  }

  removeElement() {
    this.#element = null;
  }
}
