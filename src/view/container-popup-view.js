import { createElement } from '../render.js';

export const createContainerPopUpTemplate = () =>
  `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
    <div class="film-details__close">
    <button class="film-details__close-btn" type="button">close</button>
  </div>
  <section class="film-details__controls">
  <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
  <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>
  <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
</section>
</div>
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
