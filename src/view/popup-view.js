import SmartView from './smart-view';
import { getTime } from '../utils/film.js';
import dayjs from 'dayjs';
import he from 'he';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

const creatCommentCountTemplate = (comments) => comments > 0 ? `<h3 class="film-details__comments-title">Comments
<span class="film-details__comments-count">${comments}</span></h3>` : ' ';

const createCommentsTemplate = (comments, isDeleting) => {
  const {id, author, comment, date, emotion} = comments;
  const commentDate = dayjs(date).format('YYYY/MM/DD HH:mm');
  return (
    `<li class="film-details__comment" id="${id}">
    <span class="film-details__comment-emoji">
      <img src="/images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${commentDate}</span>
        ${isDeleting ? 'deleting...' : `<button class="film-details__comment-delete" data-comment-id="${id}">delete</button>`}
      </p>
    </div>
    </li>`);
};

const createPopupTemplate = (data, comments, emotionNew, commentNewText) => {
  const {title, poster, alternativeTitle, rating, director, writers, actors, filmDate, runTime, country, genres,
    description, ageRating, isWatchList, isHistory, isFavorite} = data;

  const date = dayjs(filmDate).format('DD MMMM YYYY');
  const filmRunTime = getTime(runTime);

  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./${poster}" alt="">
            <p class="film-details__age">${ageRating}+</p>
          </div>
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">${alternativeTitle}</p>
              </div>
              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${date}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${filmRunTime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genres.length === 1 ? 'Genre' : 'Genres'}</td>
                <td class="film-details__cell">
                ${genres.join(', ')}
              </tr>
            </table>
            <p class="film-details__film-description">
            ${description}
            </p>
          </div>
        </div>
        <section class="film-details__controls">
          <button type="button" class="film-details__control-button
            film-details__control-button--watchlist
            ${isWatchList ? 'film-details__control-button--active' : ''}"
            id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button
            film-details__control-button--watched
            ${isHistory ? 'film-details__control-button--active' : ''}"
            id="watched name="watched">Already watched
          </button>
          <button type="button" class="film-details__control-button
            film-details__control-button--favorite
            ${isFavorite ? 'film-details__control-button--active' : ''}"
            id="favorite" name="favorite">Add to favorites
          </button>
        </section>
        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            ${creatCommentCountTemplate(comments.length)}
            <ul class="film-details__comments-list">
            ${comments.map((comment) => createCommentsTemplate(comment, data.deletingCommentId === comment.id)).join(' ')}
            </ul>
            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
              ${emotionNew ? `<img src="./images/emoji/${emotionNew}.png"
              width="55" height="55" alt="emoji-${emotionNew}">` : '' }
            </div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"
              ${data.isDisabled ? 'disabled' : ''}>${commentNewText ? commentNewText : ''}</textarea>
            </label>
            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile"
              ${data.isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping"
              ${data.isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke"
              ${data.isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry"
              ${data.isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
          </section>
        </div>
    </form>
  </section>`);
};

export default class PopupView extends SmartView {
  #comments = null;
  #currentScrollTop = 0;
  #emotionNew = null;
  #commentNewText = null;

  constructor(film, comments, emotionNew, commentNewText) {
    super();
    this._data = PopupView.parseFilmToData(film);
    this.#comments = PopupView.parseCommentsToData(comments);
    this.#emotionNew = emotionNew;
    this.#commentNewText = commentNewText;
    this.#setInnerHandlers();
    this.element.addEventListener('scroll', this.#scrollHandler);
  }

  get template() {
    return createPopupTemplate(this._data, this.#comments, this.#emotionNew, this.#commentNewText);
  }

  restoreHandlers = () => {
    this.setClosePopupButtonClickHandler(this._callback.closeButtonClick);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setSubmitFormClickHandler(this._callback.submitComment);
    this.#setInnerHandlers();
    this.element.scrollTop = this.#currentScrollTop;
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  };

  setClosePopupButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
    this.element
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this.#closeButtonClickHandler);
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchListClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((button) => {
      button.addEventListener('click', this.#deleteCommentClickHandler);
    });
  };

  setSubmitFormClickHandler = (callback) => {
    const popup = document.querySelector('.film-details');
    if(popup) {
      document.addEventListener('keydown', this.#submitFormHandler);
    }
    this._callback.submitComment = callback;
  };

  addComment = () => ({
    id: '',
    author: 'Author',
    comment: he.encode(this.#commentNewText),
    date: dayjs(),
    emotion: this.#emotionNew,
  })

  #scrollHandler = (evt) => {
    this.#currentScrollTop = evt.target.scrollTop;
  }

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
  };

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-details__control-button--active');
    this._callback.watchListClick(this._data);

  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-details__control-button--active');
    this._callback.favoriteClick(this._data);
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-details__control-button--active');
    this._callback.watchedClick(this._data);
  };

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    this.#emotionNew = evt.target.value;
    this.updateData({
      commentEmotion: this.#emotionNew,
    });
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.#commentNewText = evt.target.value;
    this.updateData({
      commentText: evt.target.value,
    }, true);
  };

  #submitFormHandler = (evt) => {
    if (evt.ctrlKey && evt.key === 'Enter') {
      if(this.#emotionNew !== '' && this.#commentNewText !== '') {
        this.updateData({
          isDisabled: true,
        });
        const newComment = this.addComment();
        this._callback.submitComment(PopupView.parseFilmToData(this._data), newComment);
      }
      document.removeEventListener('keydown', this._callback.submitComment);
      document.removeEventListener('keydown',  this.#submitFormHandler);
    }
  };

  #deleteCommentClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    this.updateData({
      isDisabled: true,
      isDeleting: true,
      deletingCommentId: evt.target.dataset.commentId,
    });
    this._callback.deleteClick(this._data, evt.target.dataset.commentId);
  };

  static parseFilmToData = (data) => ({...data,
    commentText: '',
    commentEmotion: '',
    isDisabled: false,
    isDeleting: false,
    deletingCommentId: undefined,
  });

  static parseCommentsToData = (newComments) => newComments;
}
