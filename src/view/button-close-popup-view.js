import { createElement } from '../render.js';

const createButtonClosePopupTemplate = () =>
   `<div class="film-details__close">
   <button class="film-details__close-btn" type="button">close</button>
 </div>`

 export default class ButtonClosePopupView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createButtonClosePopupTemplate(this.#element);
  }

  removeElement() {
    this.#element = null;
  }
}


