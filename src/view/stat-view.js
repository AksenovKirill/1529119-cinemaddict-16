import dayjs from 'dayjs';
import SmartView from '../view/smart-view.js';
import { getRating } from '../utils/render.js';
import { getWatchedFilmsForStatistics} from '../utils/statistics.js';
import { StatisticsFilterType } from '../const.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const MINUTES = 60;
const BAR_HEIGHT = 50;

const createStatisticsTemplate = (data) => {
  const {films, dateTo, dateFrom, currentInput} = data;
  const filmsForStatistic = getWatchedFilmsForStatistics(films, dateTo, dateFrom, currentInput);

  const keysGenres = Object.keys(filmsForStatistic.genres);
  const topGenre = keysGenres.sort((a, b) => filmsForStatistic.genres[b] - filmsForStatistic.genres[a])[0];

  const getTotalDuration = () => data.reduce((acc, film) => (acc += film.runTime),0);

  const duration = getTotalDuration(filmsForStatistic.films);
  const hours = Math.floor(duration/MINUTES);
  const minutes = duration%MINUTES;

  return (
    `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${getRating(filmsForStatistic.films.length)}</span>
  </p>
  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time"
    ${currentInput === StatisticsFilterType.ALL_TIME ? 'checked' : ''}>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today"
    ${currentInput === StatisticsFilterType.TODAY ? 'checked' : ''}>
    <label for="statistic-today" class="statistic__filters-label">Today</label>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week"
    ${currentInput === StatisticsFilterType.WEEK? 'checked' : ''}>
    <label for="statistic-week" class="statistic__filters-label">Week</label>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month"
    ${currentInput === StatisticsFilterType.MONTH ? 'checked' : ''}>
    <label for="statistic-month" class="statistic__filters-label">Month</label>
    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year"
    ${currentInput === StatisticsFilterType.YEAR ? 'checked' : ''}>
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>
  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${filmsForStatistic.films.length} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${hours > 0 ? hours : 0}<span class="statistic__item-description">h</span>${duration%MINUTES > 0 ? minutes : 0}<span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre === undefined ? ' ' : topGenre}</p>
    </li>
  </ul>
  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>
</section>`);
};

const renderGenresChart = (statisticCtx, data) => {
  const {films, dateTo, dateFrom, currentInput} = data;

  const filmsForStatistic = getWatchedFilmsForStatistics(films, dateTo, dateFrom, currentInput);
  statisticCtx.height = BAR_HEIGHT * Object.keys(filmsForStatistic.genres).length;

  const compareNumbers = (a, b) => b - a;
  const genresForChart = Object.values(filmsForStatistic.genres).sort(compareNumbers);
  const keysGenres = Object.keys(filmsForStatistic.genres);
  keysGenres.sort((a, b) => filmsForStatistic.genres[b] - filmsForStatistic.genres[a]);

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: keysGenres,
      datasets: [{
        data: genresForChart,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

export default class StatisticsView extends SmartView {
  #statisticChart = null;

  constructor(films) {
    super();
    this._data = {
      films,
      dateFrom: (() => {
        const yearCount = 1;
        return dayjs().subtract( yearCount , 'year').toDate();
      })(),
      dateTo: dayjs().toDate(),
      currentInput: 'all-time',
    };
    this.#statisticChart = null;
    this.#setCharts();
    this.setStatisticSortTypeChangeHandler();
  }

  get template() {
    return createStatisticsTemplate(this._data);
  }

  removeElement = () => {
    super.removeElement();
    if (this.#statisticChart) {
      this.#statisticChart.destroy();
      this.#statisticChart = null;
    }
  }

  restoreHandlers = () => {
    this.#setCharts();
  }

  setStatisticSortTypeChangeHandler() {
    this.element
      .querySelectorAll('.statistic__filters-input')
      .forEach((input) => input.addEventListener('click', this.#dateChangeHandler));
  }

  #dateChangeHandler = (evt) => {
    this.updateData(
      {
        currentInput: evt.target.value,
        dateFrom: (() => {
          const time = evt.target.value;
          return dayjs().subtract(1 , time).toDate();
        })(),

      },
    );
    this.setStatisticSortTypeChangeHandler();
    this.#setCharts();
  };

  #setCharts = () => {
    if (this.#statisticChart !== null) {
      this.#statisticChart = null;
    }
    const stytisticCtx = this.element.querySelector('.statistic__chart');
    this.#statisticChart = renderGenresChart(stytisticCtx, this._data);
  }
}
