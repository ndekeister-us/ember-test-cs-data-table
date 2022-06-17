import Component from '@glimmer/component';

export default class CsDataTableHeaderCellComponent extends Component {
  get getAriaSort() {
    if (this.args.sortColumnKey === this.args.column.key) {
      return this.args.sortDirection === 'asc' ? 'ascending' : 'descending';
    }

    return 'none';
  }

  get visibilityTooltip() {
    return `Click to ${this.args.column.hidden ? 'display' : 'hide'} ${
      this.args.column.label
    } column`;
  }
}
