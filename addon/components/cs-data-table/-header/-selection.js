import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class CsDataTableHeaderSelectionComponent extends Component {
  id = `${guidFor(this)}-header-selection`;

  get indeterminateState() {
    return (
      this.args.nbSelectedItems > 0 &&
      this.args.nbSelectedItems < this.args.nbItems
    );
  }

  get selectionTooltip() {
    return `${
      this.args.nbSelectedItems === this.args.nbItems ? 'Unselect' : 'Select'
    } all items`;
  }

  @action
  handleIndeterminateState() {
    document.querySelector(`#${this.id} input`).indeterminate =
      this.indeterminateState;
  }
}
