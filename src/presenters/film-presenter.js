import FilmCardView from '../view/movie-card-view.js';
import PopupView from '../view/popup-view.js';
import {render, RenderPosition } from '../render.js';

const bodyElement = document.querySelector('body');

export default class FilmPresenter {
  #filmListContainer = null;

  #filmCardComponent = null;
  #popupComponent = null;

  #film= null;

  constructor(filmListContainer) {
    this.#filmListContainer = filmListContainer;
  }

  init = (film) => {
    this.#film = film;

    this.#filmCardComponent = new FilmCardView(film);
    this.#popupComponent = new PopupView(film);

    this.#filmCardComponent.setEditClickHandler(() => {
      bodyElement.classList.add('hide-overflow');
      if (!bodyElement.contains(this.#filmCardComponent.element)) {
        render(bodyElement, this.#popupComponent, RenderPosition.BEFOREEND);
      }
      else {
        this.#filmCardComponent.element.remove(bodyElement);
        render(bodyElement, this.#popupComponent, RenderPosition.BEFOREEND);
      }
    });

    render(this.#filmListContainer, this.#filmCardComponent, RenderPosition.BEFOREEND);
  }
}
