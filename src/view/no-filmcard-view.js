import { createElement } from '../render.js';

const createNoFilmCardTemplate = () =>
  '<h2 class="films-list__title">Loading...</h2>';

export default class NoFilmCardView {
    #element = null;

    get element() {
      if (!this.#element) {
        this.#element = createElement(this.template);
      }
      return this.#element;
    }

    get template() {
      return createNoFilmCardTemplate();
    }

    removeElement() {
      this.#element = null;
    }
}
