import AbstractView from '../view/abstract-view';
import {StatusRank, RenderPosition} from '../const.js';

const MIN_FILMS_TO_EMPTY = 0;
const MIN_FILMS_TO_NOVICE = 10;
const MIN_FILMS_TO_FAN = 20;
const MIN_FILMS_TO_MOVIE_BUFF = 21;

export const render = (container, element, place) => {
  const parent = container instanceof AbstractView ? container.element : container;
  const child = element instanceof AbstractView ? element.element : element;

  switch (place) {
    case RenderPosition.BEFOREBEGIN:
      parent.before(child);
      break;
    case RenderPosition.AFTERBEGIN:
      parent.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      parent.append(child);
      break;
    case RenderPosition.AFTEREND:
      parent.after(child);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.element.remove();
  component.removeElement();
};

export const replace = (newElement, oldElement) => {
  if (newElement === null || oldElement === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  const newChild = newElement instanceof AbstractView ? newElement.element : newElement;
  const oldChild = oldElement instanceof AbstractView ? oldElement.element : oldElement;

  const parent = oldChild.parentElement;

  if (parent === null) {
    throw new Error('Parent element doesn\'t exist');
  }

  parent.replaceChild(newChild, oldChild);
};

export const getRating = (watchedFilms) => {
  if(watchedFilms === MIN_FILMS_TO_EMPTY){
    return '';
  }
  if(watchedFilms <= MIN_FILMS_TO_NOVICE){
    return StatusRank.NOVICE;
  }
  if(watchedFilms <= MIN_FILMS_TO_FAN){
    return StatusRank.FAN;
  }
  if(watchedFilms >= MIN_FILMS_TO_MOVIE_BUFF){
    return StatusRank.MOVIE_BUFF;
  }
};
