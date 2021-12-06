import { createElement } from '../render.js';

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

export default class PopupCommentsView {
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
    return createPopupCommentsTemplate(this.#data);
  }

  removeElement() {
    this.#element = null;
  }
}
