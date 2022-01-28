import { nanoid } from 'nanoid';
import SmartView from './smart-view.js';
import he from 'he';

const renderGenres = (genres) => {
  let genresList = '';
  for (const genre of genres) {
    genresList += `<span class="film-details__genre">${genre}</span>`;
  }
  return genresList;
};

const renderComments = (comments) => {
  let commentList = '';
  if (comments.length === 0) {
    return `<div>
              <p class="film-details__comment-text">${'Sorry there are no comments'}</p>
            </div>`;
  }
  for (const comment of comments) {
    commentList += `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="${comment.emoji}" width="55" height="55" alt="emoji-${comment.emoji}">
            </span>
            <div>
              <p class="film-details__comment-text">${comment.message}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.user ? comment.user : ''}</span>
                <span class="film-details__comment-day">${comment.date ? comment.date : ''}</span>
                <button type="button" class="film-details__comment-delete" data-id="${comment.id}">Delete</button>
              </p>
            </div>
          </li>`;
  }
  return commentList;
};

const createPopupTemplate = (film) =>
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
                <td class="film-details__term">${film.genres.length === 1 ? 'Genre' : 'Genres'}</td>
                <td class="film-details__cell">
                ${renderGenres(film.genres)}
              </tr>
            </table>
            <p class="film-details__film-description">
            ${film.description}
            </p>
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
            ${renderComments(film.comments)}
            </ul>
            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
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
            </div>
          </div>
          </section>
        </div>
    </form>
  </section>`;

export default class PopupView extends SmartView {
  #currentScrollTop = 0;

  constructor(film) {
    super();
    this._data = film;
    this.#setInnerHandlers();

    this.element.addEventListener('scroll', this.#handleScroll);
  }

  reset = (data) => {
    this.updateData({...data});
  };

  get template() {
    return createPopupTemplate(this._data);
  }

  restoreHandlers = () => {
    this.element.scrollTop = this.#currentScrollTop;
    this.#setInnerHandlers();
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#descriptionInputHandler);
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#handleCloseButtonClick);
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#handleWatchedClick);
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#handleFavoriteClick);
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#handleWatchListClick);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#handleWatchedClick);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#handleFavoriteClick);
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#handleWatchListClick);
  };

  setDeleteCommentButtonClickHandler = (callback) => {
    this._callback.deleteCommentClick = callback;
    const buttons = this.element.querySelectorAll('.film-details__comment-delete');
    buttons.forEach((button) => {
      button.addEventListener('click', this.#deleteCommentClick);
    });
  };

  setSubmitFormClickHandler = (callback) => {
    this._callback.submitComment = callback;
    document.addEventListener('keydown', this.#handleSubmitFormKeyDown);
  };

  setClosePopupButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
    this.element
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this.#handleCloseButtonClick);
  };

  #handleSubmitFormKeyDown = (evt) => {
    if (evt.ctrlKey && evt.key === 'Enter') {
      const commentInput = this.element.querySelector('.film-details__comment-input').value;
      const emoji = this.element.querySelector('.film-details__new-comment').querySelector('img').src;
      const newComment = {
        id: nanoid(),
        message: he.encode(commentInput),
        emoji: emoji,
        user: 'name',
        date: 'date',
      };
      this._callback.submitComment(this._data, newComment);
    }
  };

  #handleCloseButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
  };

  #deleteCommentClick = (evt) => {
    evt.preventDefault();
    this._callback.deleteCommentClick(this._data, evt.target.dataset.id);
  };

  #handleFavoriteClick = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-details__control-button--active');
    this._callback.favoriteClick(this._data);
  };

  #handleWatchedClick = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-details__control-button--active');
    this._callback.watchedClick(this._data);
  };

  #handleWatchListClick = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-details__control-button--active');
    this._callback.watchListClick(this._data);
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

}
