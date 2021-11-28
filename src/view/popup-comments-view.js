import { getRandomInteger } from "../mock/generateCard.js";
export const createCommentsTemplate = (data) => {
  console.log(data);
  const randomIndex = getRandomInteger(0, data.length - 1);
  if (data[randomIndex].comments.length === 0) {
    
    return `<div>
        <p class="film-details__comment-text">${"Пока никто не оставил комментарии"}</p>
      </div>`;
  } else {
    return data[randomIndex].comments
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
      .join("");
  }
};

export const createAmountCommentsTemplate = (data) => {
  const randomIndex = getRandomInteger(0, data.length - 1);
  return `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">
        ${data[randomIndex].comments.length}</span></h3>`
};
