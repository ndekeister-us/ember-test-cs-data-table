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

class Item {
  @tracked _selected = false;
}

export default class CsDataTableComponent extends Component {
  @tracked columns = [];

  @tracked data = [];

  @tracked isCustomizingColumns = false;

  @tracked searchText = '';

  get displayedData() {
    if (this.isSearchEnabled && this.searchText.trim() !== '') {
      let searchText = this.searchText.trim().toLowerCase();
      let searchableColumnsKeys = this.searchableColumns.map(
        (column) => column.searchKey
      );
      return this.data.filter((item) => {
        return searchableColumnsKeys.some((key) => {
          return item[key].toString().toLowerCase().includes(searchText);
        });
      });
    } else {
      return this.data;
    }
  }

  get selectedItems() {
    return this.args.allowSelection
      ? this.data.filter((item) => item._selected)
      : [];
  }

  get searchableColumns() {
    return this.columns.filter((column) => column.searchable && !column.hidden);
  }

  get isSearchEnabled() {
    return this.searchableColumns.length > 0 && this.data.length > 0;
  }

  get isToolbarEnabled() {
    return this.isSearchEnabled || this.args.allowColumnsCustomization;
  }

  @action
  initializeColumns() {
    this.columns = this.args.columns
      .filter((column) => !!column.key)
      .map((column, i) => new Column(column, i));
  }

  @action
  initializeData() {
    this.data = this.args.data.map((item) => {
      let newItem = new Item();
      Object.assign(newItem, item);
      return newItem;
    });
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
  onAllowColumnsCustomization() {
    if (!this.args.allowColumnsCustomization) {
      // Handle the case where column customization can be ongoing before @allowColumnsCustomization is set to "false",
      //  in that case stop the current column customization and reset columns to initial state
      this.isCustomizingColumns = false;
      this.resetColumns();
    }
  }

  @action
  resetColumns() {
    this.columns.forEach((column) => {
      column.reset();
    });
  }

  @action
  toggleItemsSelection() {
    if (this.selectedItems.length === this.data.length) {
      this.data.forEach((item) => {
        item._selected = false;
      });
    } else {
      this.data.forEach((item) => {
        item._selected = true;
      });
    }
  }
}
