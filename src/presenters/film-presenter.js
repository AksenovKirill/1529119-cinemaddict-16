import FilmCardView from '../view/movie-card-view.js';
import {remove,render,RenderPosition, updateItem} from '../render.js';

export default class FilmPresenter {
  #filmListContainer = null;
  changeData = null;

  #filmCardComponent = null;
  #handleCardClick = null;

  #film = null;

  constructor(filmListContainer, handleCardClick) {
    this.#filmListContainer = filmListContainer;
    this.#handleCardClick = handleCardClick;
  }

  init = (film) => {
    this.#film = film;

    const previous = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(film);

    this.#filmCardComponent.setCardClickHandler(() => {
      this.#handleCardClick(this.#film);
    });

    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCardComponent.setWatchListClickHandler(this.#handleWatchListClick);

    if (previous === null) {
      render(this.#filmListContainer, this.#filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    remove(previous);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };

  #handleFavoriteClick = (film) => {
    updateItem({...film, isFavorite: !film.isFavorite});
  };

  #handleWatchedClick = (film) => {
    updateItem({ ...film, isHistory: !film.isHistory });
  };

  #handleWatchListClick = (film) => {
    updateItem({ ...film, isWatchList: !film.isWatchList });
  };
}
