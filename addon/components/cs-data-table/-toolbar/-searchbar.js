import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { cancel, later } from '@ember/runloop';

export default class CsDataTableToolbarSearchbarComponent extends Component {
  _searchTimeout;

  id = `${guidFor(this)}-searchbar`;

  tooltipId = `${guidFor(this)}-search-tooltip`;

  @tracked initialValue;

  get tooltip() {
    return `It will look for matches in following columns: ${this.args.searchableColumns
      .map((column) => column.label)
      .join(', ')}`;
  }

  @action
  clear() {
    cancel(this._searchTimeout);
    this.initialValue = '';
    this.args.onSearch('');
    document.querySelector(`#${this.id} input`).focus();
  }

  @action
  initialize() {
    this.initialValue = this.args.value;
  }

  @action
  search(value) {
    cancel(this._searchTimeout);
    this._searchTimeout = later(() => {
      this.args.onSearch(value);
    }, this.args.debounce || 300);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    cancel(this._searchTimeout);
  }
}
