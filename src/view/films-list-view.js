import AbstractView from './abstract-view.js';

const createFilmListTemplate = () =>
  `<section class="films">
    <section class="films-list">
      <div class="films-list__container"></div>
    </section>
  </section>`;

export default class FilmListView extends AbstractView {
  get template() {
    return createFilmListTemplate();
  }

  get filmListContainerTemplate() {
    return this.element.querySelector('.films-list__container');
  }

  get filmListTemplate() {
    return this.element.querySelector('.films-list');
  }

  get filmListTopRatedTemplate() {
    return this.element
      .querySelector('.films-list--extra')
      .querySelector('.films-list__container');
  }

  get filmListMostCommentedTemplate() {
    return this.element
      .querySelector('.films-list--extra:last-child')
      .querySelector('.films-list__container');
  }
}
