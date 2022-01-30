import SmartView from './smart-view.js';
import { getRating } from '../utils/render.js';

const createUserRankTemplate = (films) => {
  const filmCount = films.filter((film) => film.isHistory).length;
  return (
    `<section class="header__profile profile">
    <p class="profile__rating">${getRating(filmCount)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`);
};

export default class UserRankView extends SmartView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createUserRankTemplate(this.#films);
  }
}
