import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class CsDataTableToolbarSearchbarComponent extends Component {
  _searchTimeout;

  id = `${guidFor(this)}-searchbar`;

  tooltipId = `${guidFor(this)}-search-tooltip`;

  get tooltip() {
    return `You can filter by: ${this.args.columns
      .map((column) => column.label)
      .join(', ')}`;
  }

  @action
  clear() {
    clearTimeout(this._searchTimeout);
    this.args.onSearch('');
    document.querySelector(`#${this.id} input`).focus();
  }

  @action
  search(value) {
    clearTimeout(this._searchTimeout);
    this._searchTimeout = setTimeout(() => {
      this.args.onSearch(value);
    }, this.args.debounce || 300);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    clearTimeout(this._searchTimeout);
  }
}
