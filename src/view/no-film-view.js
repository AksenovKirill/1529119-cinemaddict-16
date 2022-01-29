import AbstractView from './abstract-view.js';
import { FilterType } from '../const.js';

const NoFilmsTextType = {
  [FilterType.ALL_MOVIES]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no watch list films now',
  [FilterType.HISTORY]: 'There are no watched films now',
  [FilterType.FAVORITES]: 'There are no favorite films now',
};

const createNoFilmTemplate = (filterType) => {
  const noFilmTextValue = NoFilmsTextType[filterType];

  return `<h2 class="films-list__title">${noFilmTextValue}</h2>`;
};

export default class NoFilmView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoFilmTemplate(this._data);
  }
}
