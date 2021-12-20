import AbstractView from './abstract-view.js';

const createSiteMenuTemplate = (data) =>
  `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;

export default class SiteMenuView extends AbstractView {
    #data = null;

    constructor(data) {
      super();
      this.#data = data;
    }

    get template() {
      return createSiteMenuTemplate(this.#data);
    }
}
