import AbstractView from './abstract-view.js';

const createNoFilmCardTemplate = () =>
`<section class="films">
<section class="films-list">
  <h2 class="films-list__title">Loading...</h2>
</section>
</section>`;

export default class NoFilmCardView extends AbstractView {
  get template() {
    return createNoFilmCardTemplate();
  }
}
