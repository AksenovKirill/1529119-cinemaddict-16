import { getRandomInteger } from "../mock/generateCards.js";
export const createMostCommentedFilmCardTepmplate = (data) => {
  const randomIndex = getRandomInteger(0, data.length - 1);
  if (data[randomIndex].comments.length < 3) {
    return `  
            <p class="film-card__description">${"Sorry, there are currently no discussed films"}</p>`;
  } else {
    return `<article class="film-card">
        <a class="film-card__link">
          <h3 class="film-card__title">Santa Claus Conquers the Martians</h3>
          <p class="film-card__rating">${data[randomIndex].raiting}</p>
          <p class="film-card__info">
            <span class="film-card__year">${data[randomIndex].year}</span>
            <span class="film-card__duration">1h 21m</span>
            <span class="film-card__genre">${data[randomIndex].genre}</span>
          </p>
          <img src="./images/posters/${data[randomIndex].poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${data[randomIndex].description}</p>
          <span class="film-card__comments">${data[randomIndex].comments.length} comments</span>
        </a>
        <div class="film-card__controls">
          <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
          <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
          <button class="film-card__controls-item film-card__controls-item--favorite film-card__controls-item--active" type="button">Mark as favorite</button>
        </div>
      </article>`;
  }
};
