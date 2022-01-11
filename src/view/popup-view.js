import SmartView from './smart-view.js';

export const createPopupCommentsTemplate = (comments) => {
  if (comments.length === 0) {
    return `<div>
              <p class="film-details__comment-text">${'Sorry there are no comments'}</p>
            </div>`;
  }
  return comments
    .map(
      (comment) =>
        `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${comment.emoji}" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${comment.message}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.user}</span>
                <span class="film-details__comment-day">${comment.date}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`
    )
    .join('');
};

export const createPopupNewCommentsTemplate = (film) =>
  `<div class="film-details__add-emoji-label">
    ${film.emoji ? `<img src="./images/emoji/${film.emoji}.png" width="55" height="55" alt="emoji-${film.emoji}">` : '' }
  </div>
  <label class="film-details__comment-label">
    <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
  </label>
  <div class="film-details__emoji-list">
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
    <label class="film-details__emoji-label" for="emoji-smile">
      <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
    </label>
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
    <label class="film-details__emoji-label" for="emoji-sleeping">
      <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
    </label>
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
    <label class="film-details__emoji-label" for="emoji-puke">
      <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
    </label>
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
    <label class="film-details__emoji-label" for="emoji-angry">
      <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
    </label>
  </div>`;

export const createPopupTemplate = (film) =>
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${film.poster}" alt="">
            <p class="film-details__age">${film.ageRating}</p>
          </div>
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">The Great Flamarion</h3>
                <p class="film-details__title-original">Original: The Great Flamarion</p>
              </div>
              <div class="film-details__rating">
                <p class="film-details__total-rating">${film.rating}</p>
              </div>
            </div>
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${film.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${film.screenwriter}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${film.actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${film.date}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${film.runTime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${film.country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                <span class="film-details__genre">${film.genre}</span></td>
              </tr>
            </table>
            <p class="film-details__film-description">${film.description}</p>
          </div>
        </div>
        <section class="film-details__controls">
          <button type="button" class="film-details__control-button
            film-details__control-button--watchlist
            ${film.isWatchList ? 'film-details__control-button--active' : ''}"
            id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button
            film-details__control-button--watched
            ${film.isHistory ? 'film-details__control-button--active' : ''}"
            id="watched name="watched">Already watched
          </button>
          <button type="button" class="film-details__control-button
            film-details__control-button--favorite
            ${film.isFavorite ? 'film-details__control-button--active' : ''}"
            id="favorite" name="favorite">Add to favorites
          </button>
        </section>
        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments
            <span class="film-details__comments-count">${film.comments.length}</span>
            </h3>
            <ul class="film-details__comments-list">
            ${createPopupCommentsTemplate(film.comments)}
            </ul>
            <div class="film-details__new-comment">${createPopupNewCommentsTemplate(film)}</div>
          </section>
        </div>
    </form>
  </section>`;

export default class PopupView extends SmartView {
  #currentScrollTop = 0;

  constructor(film) {
    super();
    this._data = PopupView.parseFilmToData(film);
    this.#setNewCommentClickHandlers();

    this.element.addEventListener('scroll', this.#handleScroll);
  }

  get template() {
    return createPopupTemplate(this._data);
  }

  get templateComments() {
    return createPopupCommentsTemplate(this._data);
  }

  get templatePopupCommentsList() {
    return this.element.querySelector('.film-details__comments-list');
  }

  get templateNewComments() {
    return createPopupNewCommentsTemplate(this._data);
  }

  restoreHandlers = () => {
    this.element.scrollTop = this.#currentScrollTop;
    this.#setNewCommentClickHandlers();
    this.setClosePopupButtonClickHandler(this._callback.closeButtonClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
  };

  #setNewCommentClickHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#descriptionInputHandler);
  };

  #emojiClickHandler = (evt) => {
    evt.stopPropagation();
    this.updateData({
      emoji: evt.target.value,
    });
  };

  #handleScroll = (evt) => {
    this.#currentScrollTop = evt.target.scrollTop;
  }

  #descriptionInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      commentText: evt.target.value,
    }, true);
  };

  setClosePopupButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
    this.element
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this.#handleCloseButtonClick);
  };

  #handleCloseButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#handleFavoriteClick);
  };

  #handleFavoriteClick = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-details__control-button--active');
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#handleWatchedClick);
  };

  #handleWatchedClick = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-details__control-button--active');
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#handleWatchListClick);
  };

  #handleWatchListClick = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-details__control-button--active');
  };

  setSubmitNewCommentHandler = (callback) => {
    this._callback.newCommentSubmit = callback;
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#handleSubmitNewComment);
  };

  #handleSubmitNewComment = (evt) => {
    evt.preventDefault();
    this._callback.newCommentSubmit(PopupView.parseDataToFilm(this._data));

  };

  setDeleteCommentClickHandler = (callback) => {
    this._callback.deleteCommentClick = callback;
    this.element
      .querySelector('.film-details__comment-delete')
      .addEventListener('click', this.#handleDeleteComment);
  };

  #handleDeleteComment = (evt) => {
    evt.preventDefault();
    this._callback.deleteCommentClick(PopupView.parseDataToFilm(this._data));
  };

  static parseFilmToData = (film) => ({...film,
    isEmoji: null,
    emoji: null,
  });

  static parseDataToFilm = (data) => {
    const film = {...data};

    if(!film.isEmoji) {
      film.emoji === null;
    }

    delete film.isEmoji;

    return film;
  };
}
