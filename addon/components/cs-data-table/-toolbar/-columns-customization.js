import Component from '@glimmer/component';

export default class CsDataTableToolbarColumnsCustomizationComponent extends Component {
  get filteredColumns() {
    return this.args.columns.filter((column) => column.hidden);
  }

  get isResetButtonDisabled() {
    return this.args.columns.every((column) => !column.isCustomized);
  }
}
