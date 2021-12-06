import { createElement } from '../render.js';

const createPopupTemplate = (data) => (
  `<div class="film-details__info-wrap">
  <div class="film-details__poster">
    <img class="film-details__poster-img" src="./images/posters/${data.poster}" alt="">

    <p class="film-details__age">${data.ageRaiting}</p>
  </div>

  <div class="film-details__info">
    <div class="film-details__info-head">
      <div class="film-details__title-wrap">
        <h3 class="film-details__title">The Great Flamarion</h3>
        <p class="film-details__title-original">Original: The Great Flamarion</p>
      </div>

      <div class="film-details__rating">
        <p class="film-details__total-rating">${data.raiting}</p>
      </div>
    </div>

    <table class="film-details__table">
      <tr class="film-details__row">
        <td class="film-details__term">${data.director}</td>
        <td class="film-details__cell">Anthony Mann</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Writers</td>
        <td class="film-details__cell">Anne Wigton, Heinz Herald, Richard Weil</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Actors</td>
        <td class="film-details__cell">Erich von Stroheim, Mary Beth Hughes, Dan Duryea</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Release Date</td>
        <td class="film-details__cell">${data.realeaseDate}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Runtime</td>
        <td class="film-details__cell">1h 18m</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Country</td>
        <td class="film-details__cell">USA</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Genres</td>
        <td class="film-details__cell">
          <span class="film-details__genre">${data.genre}</span></td>
      </tr>
    </table>

    <p class="film-details__film-description">
      ${data.description}
    </p>
  </div>
  </div>`);

export default class PopupView {
  #element = null;
  #data = null;

  constructor(data) {
    this.#data = data;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createPopupTemplate(this.#data);
  }

  removeElement() {
    this.#element = null;
  }
}
