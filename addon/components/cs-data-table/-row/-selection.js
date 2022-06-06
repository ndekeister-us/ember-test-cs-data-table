import Component from '@glimmer/component';

export default class CsDataTableHeaderSelectionComponent extends Component {
  get selectionTooltip() {
    return `${this.args.item._selected ? 'Unselect' : 'Select'}`;
  }
}
