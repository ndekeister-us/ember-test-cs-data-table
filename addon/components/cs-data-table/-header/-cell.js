import Component from '@glimmer/component';

export default class CsDataTableHeaderCellComponent extends Component {
  get visibilityTooltip() {
    return `Click to ${this.args.column.hidden ? 'display' : 'hide'} ${
      this.args.column.label
    } column`;
  }
}
