export const createPopupCommentsTemplate = (data) => {
  if (data.comments.length === 0) {
    return `<div>
        <p class="film-details__comment-text">${'Sorry there are no comments'}</p>
      </div>`;
  }
  return data.comments
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

export const createAmountCommentsTemplate = (data) => (
  `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">
  ${data.comments.length}</span></h3>`
);
