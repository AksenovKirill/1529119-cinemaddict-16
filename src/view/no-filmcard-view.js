import AbstractView from './abstract-view.js';

const createNoFilmCardTemplate = () =>
  '<h2 class="films-list__title">Loading...</h2>';

export default class NoFilmCardView extends AbstractView {
  get template() {
    return createNoFilmCardTemplate();
  }
}
