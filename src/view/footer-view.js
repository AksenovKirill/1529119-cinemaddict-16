import AbstractView from './abstract-view.js';

const createFooterTemplate = (data) => (
  `<p>${data.length} movies inside</p>`
);

export default class FooterView extends AbstractView {
  #data = null;

  constructor(data) {
    super();
    this.#data = data;
  }

  get template() {
    return createFooterTemplate(this.#data);
  }
}
