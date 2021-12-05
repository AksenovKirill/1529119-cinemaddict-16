import { createElement } from '../render.js';

export const createContainerPopUpTemplate = () =>
  `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">

        <ul class="film-details__comments-list">
        </ul>


      </section>
    </div>
  </form>
</section>`;

export default class ContainerPopupView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createContainerPopUpTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
