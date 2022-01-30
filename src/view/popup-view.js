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

const createCommentsTemplate = (comments) => {
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
        <button class="film-details__comment-delete"data-comment-id="${id}">Delete</button>
      </p>
    </div>
    </li>`);
};

const createPopupTemplate = (data, comments, emotionNew, commentNewText, isDisabled) => {
  const {title, poster, alternativeTitle, rating, director, writers, actors, filmDate, runTime, country, genres,
    description, ageRating, isWatchList, isHistory, isFavorite } = data;

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
            ${comments.map((comment) => createCommentsTemplate(comment)).join(' ')}
            </ul>
            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
              ${emotionNew ? `<img src="./images/emoji/${emotionNew}.png"
              width="55" height="55" alt="emoji-${emotionNew}">` : '' }
            </div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"
              ${isDisabled ? 'disabled' : ''}>${commentNewText ? commentNewText : ''}</textarea>
            </label>
            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile"
              ${isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping"
              ${isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke"
              ${isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry"
              ${isDisabled ? 'disabled' : ''}>
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
  #emotionNew = null;
  #commentNewText = null;
  #idCommentDelete = null;
  #isDeleting = null;
  #isDisabled = null;

  constructor(film, comments, emotionNew, commentNewText, isDeleting, idCommentDelete, isDisabled) {
    super();
    this._data = PopupView.parseFilmToData(film);
    this.#comments = PopupView.parseCommentsToData(comments);
    this.#emotionNew = emotionNew;
    this.#commentNewText = commentNewText;
    this.#isDeleting = isDeleting;
    this.#isDisabled = isDisabled;
    this.#idCommentDelete = idCommentDelete;
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupTemplate(this._data, this.#comments, this.#emotionNew, this.#commentNewText, this.#isDeleting, this.#idCommentDelete, this.#isDisabled);
  }

  reset = (film, comments) => {
    this._data = PopupView.parseFilmToData({ ...film });
    this.#comments = comments;
    //this.#scrollTop = 0;
    this.#emotionNew = ' ';
    this.#commentNewText = '';
    this.updateData(this._data);
    this.updateData(this.#comments);
  };

  restoreHandlers = () => {
    this.setClosePopupButtonClickHandler(this.#handleCloseButtonClick);
    this.setWatchListClickHandler(this.#handleWatchListClick);
    this.setWatchedClickHandler(this.#handleWatchedClick);
    this.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.setDeleteClickHandler(this._callback.deleteCommentClick);
    this.setSubmitFormClickHandler(this.#handleSubmitForm);
    this.#setInnerHandlers();
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  };

  setClosePopupButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
    this.element
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this.#handleCloseButtonClick);
  };

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#handleWatchListClick);
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

  setDeleteClickHandler = (callback) => {
    this._callback.deleteCommentClick = callback;
    this.element.querySelectorAll('.film-details__comments').forEach((button) => {
      button.addEventListener('click', this.#deleteCommentClick);
    });
  };

  setSubmitFormClickHandler = (callback) => {
    const popup = document.querySelector('.film-details');
    if(popup) {
      document.addEventListener('keydown', this.#handleSubmitForm);
    }
    this._callback.submitComment = callback;
  };

  resetDataForNewComment = () => {
    this.#emotionNew = ' ';
    this.#commentNewText = '';
    this.updateData({...this._data});
  }

  addComment = () => {
    if (this._data.emotionNew === '' || this._data.emotionNew === false || this._data.commentNewText === '') {
      return;
    }

    const newComment = {
      id: '',
      author: 'Alex Ivanov',
      comment: he.encode(this.#commentNewText),
      date: dayjs(),
      emotion: this.#emotionNew,
    };
    this.#comments.push(newComment);
    this.updateData(this._data);
  }

  #handleCloseButtonClick = (evt) => {
    evt.preventDefault();
    this.#emotionNew = ' ';
    this.#commentNewText = '';
    this._callback.closeButtonClick();
  };

  #handleWatchListClick = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-details__control-button--active');
    this._callback.watchListClick(this._data);
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

  #handleSubmitForm = (evt) => {
    if (evt.ctrlKey && evt.key === 'Enter') {
      if(this.#emotionNew !== '' && this.#commentNewText !== '') {
        this.#isDisabled = true;
        const newComment = this.addComment();
        this._callback.submitComment(PopupView.parseFilmToData(this._data), newComment, PopupView.parseCommentsToData(this.#comments),
          this.#emotionNew, this.#commentNewText);
        document.removeEventListener('keypress', this.#handleSubmitForm);
      }
    }
  };

  #deleteCommentClick = (evt) => {
    evt.preventDefault();
    const idComment = evt.target.dataset.commentId;
    this._callback.deleteClick(idComment);
    const deleteButton = this.element.querySelector(`[data-comment-id = "${idComment}"]`);
    deleteButton.disabled = true;
    deleteButton.textContent = 'Deleting...';
  };

  static parseFilmToData = (data) => ({ ...data, commentText: '', commentEmotion: ' ' });

  static parseCommentsToData = (newComments) =>  newComments;
}
