import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

class Column {
  key;
  label;
  searchable;
  searchKey;

  // Tracked data
  @tracked hidden;
  @tracked order;

  // Used for reset method
  _hidden;
  _order;

  constructor(
    { hidden = false, key, label = key, searchable = false, searchKey = key },
    index
  ) {
    this.key = key;
    this.label = label;
    this.searchable = searchable;
    this.searchKey = searchKey;

    this.hidden = hidden;
    this._hidden = this.hidden;
    this.order = index;
    this._order = this.order;
  }

  get isCustomized() {
    return this.hidden !== this._hidden || this.order !== this._order;
  }

  reset() {
    this.hidden = this._hidden;
    this.order = this._order;
  }
}

export default class CsDataTableComponent extends Component {
  @tracked columns = [];

  @tracked isCustomizingColumns = false;

  @tracked searchText = '';

  get data() {
    if (this.isSearchEnabled && this.searchText.trim() !== '') {
      let searchText = this.searchText.trim().toLowerCase();
      let searchableColumnsKeys = this.searchableColumns
        .filter((column) => !column.hidden)
        .map((column) => column.searchKey);
      return this.args.data.filter((item) => {
        return searchableColumnsKeys.some((key) => {
          return item[key].toString().toLowerCase().includes(searchText);
        });
      });
    } else {
      return this.args.data;
    }
  }

  get searchableColumns() {
    return this.columns.filter((column) => column.searchable);
  }

  get isSearchEnabled() {
    return this.searchableColumns.length > 0 && this.args.data.length > 0;
  }

  get isToolbarEnabled() {
    return this.isSearchEnabled || this.args.allowColumnsCustomization;
  }

  @action
  initializeColumns() {
    this.columns = this.args.columns
      .filter((column) => !!column.key)
      .map((column, i) => new Column(column, i));

    if (!this.args.allowColumnsCustomization) {
      this.isCustomizingColumns = false;
    }
  }

  @action
  moveColumn(columnToMove, newOrder) {
    this.columns.forEach((column) => {
      if (column.order === newOrder) {
        if (column.order < columnToMove.order) {
          column.order++;
        } else {
          column.order--;
        }
      }
    });

    columnToMove.order = newOrder;
  }

  @action
  resetColumns() {
    this.columns.forEach((column) => {
      column.reset();
    });
  }
}
