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

  <p class="film-details__age">${data.ageRating}</p>
</div>

<div class="film-details__info">
  <div class="film-details__info-head">
    <div class="film-details__title-wrap">
      <h3 class="film-details__title">The Great Flamarion</h3>
      <p class="film-details__title-original">Original: The Great Flamarion</p>
    </div>

    <div class="film-details__rating">
      <p class="film-details__total-rating">${data.rating}</p>
    </div>
  </div>

  <table class="film-details__table">
    <tr class="film-details__row">
      <td class="film-details__term">Director</td>
      <td class="film-details__cell">${data.director}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Writers</td>
      <td class="film-details__cell">${data.screenwriter}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Actors</td>
      <td class="film-details__cell">${data.actors}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Release Date</td>
      <td class="film-details__cell">${data.year}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Runtime</td>
      <td class="film-details__cell">${data.runTime}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Country</td>
      <td class="film-details__cell">${data.country}</td>
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

  setEditClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

  #editClickCloseButtonHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
    this.element.remove();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    const buttonControls = this.element.querySelectorAll('.film-details__control-button');
    buttonControls.forEach((button) => {
      if(evt.target === button ) {
        document.querySelector('.film-details__control-button--active').classList.remove('film-details__control-button--active');
        evt.target.classList.add('film-details__control-button--active');
      }
    });
  }
}
