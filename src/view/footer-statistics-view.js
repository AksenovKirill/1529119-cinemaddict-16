import { createElement } from '../render.js';

const createFooterStatisticsTemplate = (data) => (
  `<p>${data.length} movies inside</p>`
);

export default class FooterStatisticsView {
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
    return createFooterStatisticsTemplate(this.#data);
  }

  removeElement() {
    this.#element = null;
  }
}
