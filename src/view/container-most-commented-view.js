import { createElement } from '../render.js';

const createContainerMostCommentedFilmTemplate = () =>
  `<section class="films-list films-list--extra most">
    <h2 class="films-list__title">Most commented</h2>
    <div class="films-list__container">
    </div>
    </section>`;

export default class ContainerMostCommentedFilmView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createContainerMostCommentedFilmTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
