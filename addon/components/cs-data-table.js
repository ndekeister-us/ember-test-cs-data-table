import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class CsDataTableComponent extends Component {
  @tracked searchText = '';

  get data() {
    if (this.isSearchEnabled && this.searchText.trim() !== '') {
      let searchText = this.searchText.trim().toLowerCase();
      let searchableColumnsKeys = this.searchableColumns.map(
        (column) => column.searchKey || column.key
      );
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
    return this.args.columns.filter((column) => column.searchable);
  }

  get isSearchEnabled() {
    return this.searchableColumns.length > 0 && this.args.data.length > 0;
  }

  get isToolbarEnabled() {
    return this.isSearchEnabled;
  }
}
