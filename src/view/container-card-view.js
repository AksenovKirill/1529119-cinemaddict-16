import { createElement } from '../render.js';

export const createSectionFilmsTemplate = () =>
  `<section class="films">
  <section class="films-list">
  <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  <div class="films-list__container">
  </div>
  </section>
  <section class="films-list films-list--extra">
  <h2 class="films-list__title">Top rated</h2>
  <div class="films-list__container">

  </div>
  </section>
  <section class="films-list films-list--extra">
  <h2 class="films-list__title">Most commented</h2>
  <div class="films-list__container">

  </div>
  </section>
  </section>`;

export default class SectionFilmsView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createSectionFilmsTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
