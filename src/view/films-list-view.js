import AbstractView from './abstract-view.js';

const createFilmListTemplate = () =>
  `<section class="films">
    <section class="films-list">
      <div class="films-list__container"></div>
    </section>
  </section>
  <footer class="footer">
    <section class="footer__logo logo logo--smaller">Cinemaddict</section>

</footer>`;

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

}
