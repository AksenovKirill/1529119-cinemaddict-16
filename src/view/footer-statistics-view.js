import AbstractView from './abstract-view.js';

const createFooterStatisticsTemplate = (data) => (
  `<p>${data.length} movies inside</p>`
);

export default class FooterStatisticsView extends AbstractView {
  #data = null;

  constructor(data) {
    super();
    this.#data = data;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#data);
  }
}
