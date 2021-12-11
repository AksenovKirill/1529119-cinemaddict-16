import AbstractView from './abstract-view.js';

const createPopupCommentsTemplate = (data) => {
  if (data.length === 0) {
    return `<div>
        <p class="film-details__comment-text">${'Sorry there are no comments'}</p>
      </div>`;
  }
  return data
    .map(
      (comment) =>
        `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
            <img src="./images/emoji/${comment.emoji}" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">I${comment.message}</p>
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

export default class PopupCommentsView extends AbstractView {
  #data = null;

  constructor(data) {
    super();
    this.#data = data;
  }

  get template() {
    return createPopupCommentsTemplate(this.#data);
  }
}
