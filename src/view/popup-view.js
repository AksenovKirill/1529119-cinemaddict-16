import AbstractView from './abstract-view.js';

export const createPopupTemplate = (data) =>
  `<section class="film-details">
<form class="film-details__inner" action="" method="get">
  <div class="film-details__top-container">
  <div class="film-details__close">
  <button class="film-details__close-btn" type="button">close</button>
</div>
<div class="film-details__info-wrap">
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
</div>
<section class="film-details__controls">
<button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
<button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>
<button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
</section>
</div>
  <div class="film-details__bottom-container">

    <section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">
    ${data.comments.length}</span></h3>
      <ul class="film-details__comments-list">

      </ul>


    </section>
  </div>
</form>
</section>`;

export default class PopupView extends AbstractView {
  #data = null;

  constructor(data) {
    super();
    this.#data = data;
  }

  get template() {
    return createPopupTemplate(this.#data);
  }

  setEditClickCloseButtonHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#editClickCloseButtonHandler);
  }

    #editClickCloseButtonHandler = (evt) => {
      evt.preventDefault();
      this._callback.editClick();
      this.element.remove();
    }
}
