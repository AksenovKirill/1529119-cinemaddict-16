import SmartView from './smart-view';
import { nanoid } from 'nanoid';
import { getTime } from '../utils/film.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

const creatCommentCountTemplate = (comments) => comments > 0 ? `<h3 class="film-details__comments-title">Comments
  <span class="film-details__comments-count">${comments}</span></h3>` : ' ';

const createFilmPopupCommentsTemplate = (commentItem) => {
  const {id, author, comment, dateComment, emotion} = commentItem;

  return (
    `<li class="film-details__comment" id="${id}">
    <span class="film-details__comment-emoji">
      <img src="/images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dateComment}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
    </li>`);
};

const createPopupAllCommentsTemplate = (commentsText) => commentsText.map((comment) => createFilmPopupCommentsTemplate(comment)).join(' ');

const createPopupTemplate = (film, comments, emotionNew, commentText) => {
  const {title,
     poster,
     alternativeTitle,
     rating,
     director,
     writers, actors,
     filmDate,
     runTime,
     country,
     genres,
     description,
     ageRating,
     isWatchList,
     isHistory,
     isFavorite } = film;

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
                <td class="film-details__cell">${actors}</td>
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
                ${genres}
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
            <h3 class="film-details__comments-title">Comments
            <span class="film-details__comments-count">${creatCommentCountTemplate(comments)}</span>
            </h3>
            <ul class="film-details__comments-list">
            ${createPopupAllCommentsTemplate(comments)}
            </ul>
            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
              ${film.emotion ? `<img src="./images/emoji/${film.emotion}.png" width="55" height="55" alt="emoji-${film.emotion}">` : '' }
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
  </section>`);
};

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
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
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

  setDeleteClickHandler = (callback) => {
    this._callback.deleteCommentClick = callback;
    this.element.querySelectorAll('.film-details__comments').forEach((button) => {
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

  /* createNewComment() {
    return {
      id: nanoid(),
      author: 'Kirill Aksenov',
      comment: he.encode(this._data.commentText),
      dateComment: dayjs().fromNow(),
      emotion: `./images/emoji/${this._data.commentEmotion}.png`,
 */

  #handleSubmitFormKeyDown = (evt) => {
    if (evt.keyCode === 13 && (evt.metaKey || evt.ctrlKey) && (evt.keyCode === 13 || evt.keyCode === 10) && (evt.metaKey || evt.ctrlKey)) {
      if(this.#emotionNew !== '' && this.#commentNewText !== '') {
        const newComment = this.createNewComment();
        this.#emotionNew = '';
        this.#commentNewText = '';
        this._callback.submitComment(FilmInfotmationView.parseFilmToData(this._data), newComment, PopupView.parseCommentsToData(this.#comments),
        this.#emotionNew, this.#commentNewText);
      }
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
    evt.preventDefault();
    this.#emotionNew = evt.target.value;
    this._callback.getComments(evt.target.value);
    this.updateData({
      commentEmotion: this.#emotionNew,
    });
  };

  #handleScroll = (evt) => {
    this.#currentScrollTop = evt.target.scrollTop;
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.#commentNewText = evt.target.value;
    this._callback.getCommentNewText(evt.target.value);
    this.updateData({
      commentText: evt.target.value,
    }, true);
  };

  static parseFilmToData = (data) => {
    const film = { ...data, commentText: '', commentEmotion: ' ' };
    return film;
  }

  static parseCommentsToData = (newComments) => {
    const comments = newComments;
    return comments;
  }

}
