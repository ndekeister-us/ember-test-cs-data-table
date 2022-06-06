import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import {
  click,
  fillIn,
  find,
  render,
  settled,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | cs-data-table', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders nothing when @columns is empty', async function (assert) {
    this.columns = [];
    this.data = [
      {
        key: 'col1',
      },
    ];

    await render(
      hbs`<CsDataTable @columns={{this.columns}} @data={{this.data}}></CsDataTable>`
    );

    assert.dom('[data-test-cs-data-table]').doesNotExist();
  });

  test('it renders correctly', async function (assert) {
    this.columns = [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'name',
        label: 'Name',
      },
      {
        key: 'gender',
        label: 'Gender',
        hidden: true,
      },
    ];
    this.data = [
      {
        id: '1',
        name: 'Name 1',
        gender: 'M',
      },
      {
        id: '2',
        name: 'Name 2',
        gender: 'F',
      },
      {
        id: '3',
        name: 'Name 3',
        gender: 'M',
      },
    ];

    await render(
      hbs`<CsDataTable class="test" @columns={{this.columns}} @data={{this.data}} as |table|>
            <table.row as |row|>
              <row.cell @key="id" as |item|>{{item.id}}</row.cell>
              <row.cell @key="name" as |item|>{{item.name}}</row.cell>
              <row.cell @key="gender" as |item|>{{item.gender}}</row.cell>
            </table.row>
          </CsDataTable>`
    );

    assert
      .dom('[data-test-cs-data-table]')
      .exists()
      .hasClass('test', 'It pass attributes');

    assert
      .dom('[data-test-header-cell-index]')
      .exists({ count: 2 }, '2 columns are displayed');

    assert
      .dom('[data-test-header-cell-index="0"]')
      .hasText('ID', 'Column 1 have correct label');
    assert
      .dom('[data-test-header-cell-index="1"]')
      .hasText('Name', 'Column 2 have correct label');

    assert
      .dom('[data-test-row-index]')
      .exists({ count: 3 }, '3 rows are displayed');

    assert
      .dom('[data-test-row-index="0"] [data-test-cell-index]')
      .exists({ count: 2 }, 'Row 1 have 2 cells');
    assert
      .dom('[data-test-row-index="0"] [data-test-cell-index="0"]')
      .hasText('1', 'Cell 1 of row 1 have correct text');
    assert
      .dom('[data-test-row-index="0"] [data-test-cell-index="1"]')
      .hasText('Name 1', 'Cell 2 of row 1 have correct text');

    assert
      .dom('[data-test-row-index="1"] [data-test-cell-index]')
      .exists({ count: 2 }, 'Row 1 have 2 cells');
    assert
      .dom('[data-test-row-index="1"] [data-test-cell-index="0"]')
      .hasText('2', 'Cell 1 of row 2 have correct text');
    assert
      .dom('[data-test-row-index="1"] [data-test-cell-index="1"]')
      .hasText('Name 2', 'Cell 2 of row 2 have correct text');

    assert
      .dom('[data-test-row-index="2"] [data-test-cell-index]')
      .exists({ count: 2 }, 'Row 1 have 2 cells');
    assert
      .dom('[data-test-row-index="2"] [data-test-cell-index="0"]')
      .hasText('3', 'Cell 1 of row 3 have correct text');
    assert
      .dom('[data-test-row-index="2"] [data-test-cell-index="1"]')
      .hasText('Name 3', 'Cell 2 of row 3 have correct text');
  });

  module('empty message', () => {
    test('it dont renders empty message when @data is empty and we dont have table.empty slot', async function (assert) {
      this.columns = [
        {
          key: 'col1',
        },
      ];
      this.data = [];

      await render(
        hbs`<CsDataTable @columns={{this.columns}} @data={{this.data}}></CsDataTable>`
      );

      assert.dom('[data-test-cs-data-table]').exists();
      assert.dom('[data-test-empty]').doesNotExist();
    });

    test('it renders empty message when @data is empty and we have table.empty slot', async function (assert) {
      this.columns = [
        {
          key: 'col1',
        },
      ];
      this.data = [];

      await render(
        hbs`<CsDataTable @columns={{this.columns}} @data={{this.data}} as |table|>
              <table.empty data-pass-attributes="test">No data</table.empty>
            </CsDataTable>`
      );

      assert.dom('[data-test-cs-data-table]').exists();
      assert.dom('[data-test-empty="empty"]').hasText('No data');
    });
  });

  module('toolbar', () => {
    module('action', () => {
      test('it yield toolbar action correctly', async function (assert) {
        this.columns = [
          {
            key: 'col1',
            label: 'Column 1',
          },
        ];
        this.data = [
          {
            col1: 'val1',
          },
        ];

        await render(
          hbs`<CsDataTable @allowSelection={{true}} @columns={{this.columns}} @data={{this.data}} as |table|>
                <table.toolbarActions as |selectedItems|>
                  <button type="button" disabled={{lt selectedItems.length 1}}>Action</button>
                </table.toolbarActions>
                <table.row as |row|>
                  <row.cell @key="col1" as |item|>{{item.col1}}</row.cell>
                </table.row>
              </CsDataTable>`
        );

        assert
          .dom('[data-test-toolbar] [data-test-actions]')
          .exists('toolbarActions is displayed');
        assert
          .dom('[data-test-toolbar] [data-test-actions] button')
          .isDisabled();

        await click('[data-test-row-index="0"] [data-test-selection-checkbox]');

        assert
          .dom('[data-test-toolbar] [data-test-actions] button')
          .isNotDisabled();
      });
    });

    module('columnsCustomization', () => {
      test('it dont display customization button correctly', async function (assert) {
        this.columns = [
          {
            key: 'col1',
            label: 'test',
          },
        ];
        this.data = [
          {
            col1: 'test',
          },
        ];

        await render(
          hbs`<CsDataTable @columns={{this.columns}} @data={{this.data}}></CsDataTable>`
        );

        assert.dom('[data-test-cs-data-table]').exists();
        assert.dom('[data-test-columns-customization]').doesNotExist();

        await render(
          hbs`<CsDataTable @allowColumnsCustomization={{false}} @columns={{this.columns}} @data={{this.data}}></CsDataTable>`
        );

        assert.dom('[data-test-cs-data-table]').exists();
        assert.dom('[data-test-columns-customization]').doesNotExist();

        await render(
          hbs`<CsDataTable @allowColumnsCustomization={{true}} @columns={{this.columns}} @data={{this.data}}></CsDataTable>`
        );

        assert.dom('[data-test-cs-data-table]').exists();
        assert.dom('[data-test-columns-customization]').exists();
      });

      test('it moves columns correctly', async function (assert) {
        this.columns = [
          {
            key: 'col1',
            label: 'Column 1',
          },
          {
            key: 'col2',
            label: 'Column 2',
          },
          {
            key: 'col3',
            label: 'Column 3',
          },
        ];
        this.data = [
          {
            col1: 'val1',
            col2: 'val2',
            col3: 'val3',
          },
        ];

        await render(
          hbs`<CsDataTable @allowColumnsCustomization={{true}} @columns={{this.columns}} @data={{this.data}} as |table|>
                <table.row as |row|>
                  <row.cell @key="col1" as |item|>{{item.col1}}</row.cell>
                  <row.cell @key="col2" as |item|>{{item.col2}}</row.cell>
                  <row.cell @key="col3" as |item|>{{item.col3}}</row.cell>
                </table.row>
              </CsDataTable>`
        );

        // Ensure initial display order is correct
        assert.dom('[data-test-header-cell-index="0"]').hasText('Column 1');
        assert.dom('[data-test-header-cell-index="1"]').hasText('Column 2');
        assert.dom('[data-test-header-cell-index="2"]').hasText('Column 3');

        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="0"]')
          .hasText('val1');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="1"]')
          .hasText('val2');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="2"]')
          .hasText('val3');

        // Start customization
        await click('[data-test-columns-customization] [data-test-start]');

        // First column should have only move-right button
        assert
          .dom('[data-test-header-cell-index="0"] [data-test-move-left]')
          .doesNotExist('Move left button is not displayed for first column');
        assert
          .dom('[data-test-header-cell-index="0"] [data-test-move-right]')
          .exists('Move right button is displayed for first column');

        // Second column should have move-left and move-right buttons
        assert
          .dom('[data-test-header-cell-index="1"] [data-test-move-left]')
          .exists(
            'Move left button is displayed when column is not first or last'
          );
        assert
          .dom('[data-test-header-cell-index="1"] [data-test-move-right]')
          .exists(
            'Move right button is displayed when column is not first or last'
          );

        // Last column should have only move-left button
        assert
          .dom('[data-test-header-cell-index="2"] [data-test-move-left]')
          .exists('Move left button is displayed for last column');
        assert
          .dom('[data-test-header-cell-index="2"] [data-test-move-right]')
          .doesNotExist('Move right button is not displayed for last column');

        // Move first column to right
        await click('[data-test-header-cell-index="0"] [data-test-move-right]');

        // Ensure display order is correct
        assert
          .dom('[data-test-header-cell-index="0"] [data-test-label]')
          .hasText('Column 2');
        assert
          .dom('[data-test-header-cell-index="1"] [data-test-label]')
          .hasText('Column 1');
        assert
          .dom('[data-test-header-cell-index="2"] [data-test-label]')
          .hasText('Column 3');

        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="0"]')
          .hasText('val2');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="1"]')
          .hasText('val1');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="2"]')
          .hasText('val3');

        // Move last column to left
        await click('[data-test-header-cell-index="2"] [data-test-move-left]');

        // Ensure display order is correct
        assert
          .dom('[data-test-header-cell-index="0"] [data-test-label]')
          .hasText('Column 2');
        assert
          .dom('[data-test-header-cell-index="1"] [data-test-label]')
          .hasText('Column 3');
        assert
          .dom('[data-test-header-cell-index="2"] [data-test-label]')
          .hasText('Column 1');

        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="0"]')
          .hasText('val2');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="1"]')
          .hasText('val3');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="2"]')
          .hasText('val1');

        // Save changes
        await click('[data-test-columns-customization] [data-test-end]');

        // Ensure display order is correct after saving
        assert
          .dom('[data-test-header-cell-index="0"] [data-test-label]')
          .hasText('Column 2');
        assert
          .dom('[data-test-header-cell-index="1"] [data-test-label]')
          .hasText('Column 3');
        assert
          .dom('[data-test-header-cell-index="2"] [data-test-label]')
          .hasText('Column 1');

        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="0"]')
          .hasText('val2');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="1"]')
          .hasText('val3');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="2"]')
          .hasText('val1');

        // Start customization
        await click('[data-test-columns-customization] [data-test-start]');

        // Reset
        await click('[data-test-columns-customization] [data-test-reset]');

        // Ensure display order is correct after reset
        assert
          .dom('[data-test-header-cell-index="0"] [data-test-label]')
          .hasText('Column 1');
        assert
          .dom('[data-test-header-cell-index="1"] [data-test-label]')
          .hasText('Column 2');
        assert
          .dom('[data-test-header-cell-index="2"] [data-test-label]')
          .hasText('Column 3');

        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="0"]')
          .hasText('val1');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="1"]')
          .hasText('val2');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="2"]')
          .hasText('val3');
      });

      test('it updates columns visibility correctly', async function (assert) {
        this.columns = [
          {
            key: 'col1',
            label: 'Column 1',
          },
          {
            key: 'col2',
            label: 'Column 2',
            hidden: true,
          },
          {
            key: 'col3',
            label: 'Column 3',
          },
        ];
        this.data = [
          {
            col1: 'val1',
            col2: 'val2',
            col3: 'val3',
          },
        ];

        await render(
          hbs`<CsDataTable @allowColumnsCustomization={{true}} @columns={{this.columns}} @data={{this.data}} as |table|>
                <table.row as |row|>
                  <row.cell @key="col1" as |item|>{{item.col1}}</row.cell>
                  <row.cell @key="col2" as |item|>{{item.col2}}</row.cell>
                  <row.cell @key="col3" as |item|>{{item.col3}}</row.cell>
                </table.row>
              </CsDataTable>`
        );

        assert.dom('[data-test-cs-data-table]').exists();
        assert.dom('[data-test-columns-customization]').exists();

        // Ensure initial display is correct, Column 2 should be hidden
        assert
          .dom('[data-test-header-cell-index]')
          .exists({ count: 2 }, '2 columns are displayed');
        assert.dom('[data-test-header-cell-index="0"]').hasText('Column 1');
        assert
          .dom('[data-test-header-cell-index="1"]')
          .doesNotExist('Column 2 is hidden');
        assert.dom('[data-test-header-cell-index="2"]').hasText('Column 3');

        // And cell of Column 2 should not be displayed too
        assert
          .dom('[data-test-row-index]')
          .exists({ count: 1 }, '1 row is displayed');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index]')
          .exists({ count: 2 }, 'Row have 2 cells');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="0"]')
          .hasText('val1');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="1"]')
          .doesNotExist(
            'Cell of second column is not displayed as column is hidden'
          );
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="2"]')
          .hasText('val3');

        // Start customization
        await click('[data-test-columns-customization] [data-test-start]');

        // Ensure visibility checkbox have correct state
        assert
          .dom(
            '[data-test-header-cell-index="0"] [data-test-visibility-checkbox]'
          )
          .isChecked('Checkbox of column 1 is checked');
        assert
          .dom(
            '[data-test-header-cell-index="1"] [data-test-visibility-checkbox]'
          )
          .isNotChecked('Checkbox of column 2 is not checked');
        assert
          .dom(
            '[data-test-header-cell-index="2"] [data-test-visibility-checkbox]'
          )
          .isChecked('Checkbox of column 3 is checked');

        // Ensure all cells including hidden ones are displayed when column customization is ongoing
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index]')
          .exists({ count: 3 }, 'All cells are displayed');

        // Make second column visible
        await click(
          '[data-test-header-cell-index="1"] [data-test-visibility-checkbox]'
        );

        // And ensure visiblity checkbox is now checked
        assert
          .dom(
            '[data-test-header-cell-index="1"] [data-test-visibility-checkbox]'
          )
          .isChecked('Checkbox of column 2 is checked');

        // Save changes
        await click('[data-test-columns-customization] [data-test-end]');

        // We should have 3 columns displayed
        assert
          .dom('[data-test-header-cell-index]')
          .exists({ count: 3 }, '3 columns are displayed');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index]')
          .exists({ count: 3 }, 'Row have 3 cells displayed');

        // Start customization
        await click('[data-test-columns-customization] [data-test-start]');

        // Ensure visibility checkbox for Column 2 still have correct state
        assert
          .dom(
            '[data-test-header-cell-index="1"] [data-test-visibility-checkbox]'
          )
          .isChecked('Checkbox of column 2 is still checked');

        // Hide Column 3
        await click(
          '[data-test-header-cell-index="2"] [data-test-visibility-checkbox]'
        );

        // Save changes
        await click('[data-test-columns-customization] [data-test-end]');

        // Column 3 should not be displayed anymore, nor corresponding cell in the row
        assert
          .dom('[data-test-header-cell-index="2"]')
          .doesNotExist('Column 3 is not displayed anymore');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="2"]')
          .doesNotExist('Cell 3 of row 1 is not displayed anymore');

        // Start customization
        await click('[data-test-columns-customization] [data-test-start]');

        // Reset
        await click('[data-test-columns-customization] [data-test-reset]');

        // Ensure visibility checkbox are correcrly reset
        assert
          .dom(
            '[data-test-header-cell-index="0"] [data-test-visibility-checkbox]'
          )
          .isChecked('Checkbox of column 1 is checked');
        assert
          .dom(
            '[data-test-header-cell-index="1"] [data-test-visibility-checkbox]'
          )
          .isNotChecked('Checkbox of column 2 is not checked');
        assert
          .dom(
            '[data-test-header-cell-index="2"] [data-test-visibility-checkbox]'
          )
          .isChecked('Checkbox of column 3 is checked');

        // Save changes
        await click('[data-test-columns-customization] [data-test-end]');

        // Ensure Column 1 and 3 are displayed and Column 2 is hidden
        assert
          .dom('[data-test-header-cell-index]')
          .exists({ count: 2 }, '2 columns are displayed');
        assert.dom('[data-test-header-cell-index="0"]').hasText('Column 1');
        assert
          .dom('[data-test-header-cell-index="1"]')
          .doesNotExist('Column 2 is not displayed');
        assert.dom('[data-test-header-cell-index="2"]').hasText('Column 3');

        // Same for cells
        assert
          .dom('[data-test-row-index]')
          .exists({ count: 1 }, '1 row is displayed');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index]')
          .exists({ count: 2 }, 'Row have 2 cells');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="0"]')
          .hasText('val1');
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="1"]')
          .doesNotExist(
            'Cell of second column is not displayed as column is hidden'
          );
        assert
          .dom('[data-test-row-index="0"] [data-test-cell-index="2"]')
          .hasText('val3');
      });
    });

    module('selection', () => {
      test('it dont display selection checkboxes when @allowSelection is false', async function (assert) {
        this.allowSelection = false;
        this.columns = [
          {
            key: 'col1',
            label: 'test',
          },
        ];
        this.data = [
          {
            col1: 'value',
          },
        ];

        await render(
          hbs`<CsDataTable @allowSelection={{this.allowSelection}} @columns={{this.columns}} @data={{this.data}} as |table|>
                <table.row as |row|>
                  <row.cell @key="col1" as |item|>{{item.col1}}</row.cell>
                </table.row>
              </CsDataTable>`
        );

        assert.dom('[data-test-header-selection]').doesNotExist();
        assert.dom('[data-test-cell-selection]').doesNotExist();
      });

      test('it dont display selection checkboxes when no data', async function (assert) {
        this.allowSelection = true;
        this.columns = [
          {
            key: 'col1',
            label: 'test',
          },
        ];
        this.data = [];

        await render(
          hbs`<CsDataTable @allowSelection={{this.allowSelection}} @columns={{this.columns}} @data={{this.data}} as |table|>
                <table.row as |row|>
                  <row.cell @key="col1" as |item|>{{item.col1}}</row.cell>
                </table.row>
              </CsDataTable>`
        );

        assert.dom('[data-test-header-selection]').doesNotExist();
        assert.dom('[data-test-cell-selection]').doesNotExist();
      });

      test('it handle selection correctly', async function (assert) {
        this.allowSelection = true;
        this.columns = [
          {
            key: 'col1',
            label: 'test',
          },
        ];
        this.data = [
          {
            col1: 'value1',
          },
          {
            col1: 'value2',
            _selected: true,
          },
        ];

        await render(
          hbs`<CsDataTable @allowSelection={{this.allowSelection}} @columns={{this.columns}} @data={{this.data}} as |table|>
                <table.row as |row|>
                  <row.cell @key="col1" as |item|>{{item.col1}}</row.cell>
                </table.row>
              </CsDataTable>`
        );

        assert
          .dom('[data-test-row-index] [data-test-cell-selection]')
          .exists(
            { count: 2 },
            'There is 2 rows, each having selection enabled'
          );

        assert
          .dom('[data-test-row-index] [data-test-selection-checkbox]:checked')
          .exists({ count: 1 }, 'There is 1 row selected');
        assert
          .dom('[data-test-header-selection] [data-test-selection-checkbox]')
          .isNotChecked('Global checkbox is not checked');
        let globalCheckbox = await find(
          '[data-test-header-selection] [data-test-selection-checkbox]'
        );
        assert.true(
          globalCheckbox.indeterminate,
          'Global checkbox is in indeterminate state'
        );

        // Click on selected checkbox
        await click('[data-test-row-index="1"] [data-test-selection-checkbox]');
        assert
          .dom('[data-test-header-selection] [data-test-selection-checkbox]')
          .isNotChecked('Global checkbox is not checked');
        globalCheckbox = await find(
          '[data-test-header-selection] [data-test-selection-checkbox]'
        );
        assert.false(
          globalCheckbox.indeterminate,
          'Global checkbox is not in indeterminate state'
        );

        // Select all checkbox
        await click('[data-test-row-index="0"] [data-test-selection-checkbox]');
        await click('[data-test-row-index="1"] [data-test-selection-checkbox]');

        assert
          .dom('[data-test-row-index] [data-test-selection-checkbox]:checked')
          .exists({ count: 2 }, 'There are 2 rows selected');
        assert
          .dom('[data-test-header-selection] [data-test-selection-checkbox]')
          .isChecked('Global checkbox is checked as all raws are selected');
        globalCheckbox = await find(
          '[data-test-header-selection] [data-test-selection-checkbox]'
        );
        assert.false(
          globalCheckbox.indeterminate,
          'Global checkbox is not in indeterminate state'
        );

        // Click on global checkbox
        await click(
          '[data-test-header-selection] [data-test-selection-checkbox]'
        );

        assert
          .dom('[data-test-row-index] [data-test-selection-checkbox]:checked')
          .doesNotExist('There is 0 row selected');
        assert
          .dom('[data-test-header-selection] [data-test-selection-checkbox]')
          .isNotChecked('Global checkbox is not checked');

        // Click on global checkbox
        await click(
          '[data-test-header-selection] [data-test-selection-checkbox]'
        );

        assert
          .dom('[data-test-row-index] [data-test-selection-checkbox]:checked')
          .exists({ count: 2 }, 'There are 2 rows selected');
        assert
          .dom('[data-test-header-selection] [data-test-selection-checkbox]')
          .isChecked('Global checkbox is checked as all raws are selected');
      });
    });

    module('filtering', () => {
      test('it hides searchbar is there is no @data', async function (assert) {
        this.columns = [
          {
            key: 'col1',
            label: 'test',
            hidden: false,
            searchable: true,
          },
        ];
        this.data = [
          {
            test: 'test',
          },
        ];

        await render(
          hbs`<CsDataTable @columns={{this.columns}} @data={{this.data}}></CsDataTable>`
        );

        assert.dom('[data-test-cs-data-table]').exists();
        assert.dom('[data-test-searchbar]').exists();

        this.set('data', []);

        await settled();

        assert.dom('[data-test-cs-data-table]').exists();
        assert.dom('[data-test-searchbar]').doesNotExist();
      });

      test('it dont display searchbar if there is no visible searchable columns', async function (assert) {
        this.columns = [
          {
            key: 'col1',
            hidden: false,
            searchable: true,
          },
        ];
        this.data = [
          {
            test: 'test',
          },
        ];

        await render(
          hbs`<CsDataTable @columns={{this.columns}} @data={{this.data}}></CsDataTable>`
        );

        assert.dom('[data-test-cs-data-table]').exists();
        assert.dom('[data-test-searchbar]').exists();

        this.set('columns', [
          {
            key: 'col1',
            hidden: true,
            searchable: true,
          },
        ]);

        await settled();

        assert.dom('[data-test-cs-data-table]').exists();
        assert.dom('[data-test-searchbar]').doesNotExist();
      });

      test('it dont display searchbar if there is no searchable columns', async function (assert) {
        this.columns = [
          {
            key: 'col1',
            hidden: false,
            searchable: true,
          },
        ];
        this.data = [
          {
            test: 'test',
          },
        ];

        await render(
          hbs`<CsDataTable @columns={{this.columns}} @data={{this.data}}></CsDataTable>`
        );

        assert.dom('[data-test-cs-data-table]').exists();
        assert.dom('[data-test-searchbar]').exists();

        this.set('columns', [
          {
            key: 'col1',
            hidden: false,
            searchable: false,
          },
        ]);

        await settled();

        assert.dom('[data-test-cs-data-table]').exists();
        assert.dom('[data-test-searchbar]').doesNotExist();
      });

      test('it disable global checkbox if searchText is not empty', async function (assert) {
        this.columns = [
          {
            key: 'col1',
            hidden: false,
            searchable: true,
          },
        ];
        this.data = [
          {
            col1: 'val1',
          },
        ];

        await render(
          hbs`<CsDataTable @allowSelection={{true}} @columns={{this.columns}} @data={{this.data}} @debounce="0" as |table|>
                  <table.row as |row|>
                    <row.cell @key="col1" as |item|>{{item.col1}}</row.cell>
                  </table.row>
                </CsDataTable>`
        );

        assert
          .dom('[data-test-header-selection] [data-test-selection-checkbox]')
          .isNotDisabled();

        await fillIn('[data-test-input]', 'v');
        await triggerKeyEvent('[data-test-input]', 'keyup', 'Enter');

        assert
          .dom('[data-test-header-selection] [data-test-selection-checkbox]')
          .isDisabled();
      });

      test('it filters only visible and searchable columns', async function (assert) {
        this.columns = [
          {
            key: 'col1',
            hidden: false,
            searchable: true,
          },
          {
            key: 'col2',
            hidden: true,
            searchable: true,
          },
          {
            key: 'col3',
            hidden: false,
            searchable: false,
          },
        ];
        this.data = [
          {
            col1: 'columnVisibleAndSearchable',
            col2: 'columnHiddenAndSearchable',
            col3: 'columnHiddenVisibleAndNotSearchable',
          },
        ];

        await render(
          hbs`<CsDataTable @columns={{this.columns}} @data={{this.data}} @debounce="0" as |table|>
                  <table.row as |row|>
                    <row.cell @key="col1" as |item|>{{item.col1}}</row.cell>
                    <row.cell @key="col2" as |item|>{{item.col2}}</row.cell>
                    <row.cell @key="col3" as |item|>{{item.col3}}</row.cell>
                  </table.row>
                </CsDataTable>`
        );

        assert.dom('[data-test-cs-data-table]').exists();
        assert
          .dom('[data-test-row-index]')
          .exists({ count: 1 }, '1 row is displayed');

        await fillIn('[data-test-input]', 'columnHiddenAndSearchable');
        await triggerKeyEvent('[data-test-input]', 'keyup', 'Enter');

        assert.dom('[data-test-cs-data-table]').exists();
        assert.dom('[data-test-row-index]').doesNotExist();

        await fillIn('[data-test-input]', 'columnHiddenAndNotSearchable');
        await triggerKeyEvent('[data-test-input]', 'keyup', 'Enter');

        assert.dom('[data-test-cs-data-table]').exists();
        assert.dom('[data-test-row-index]').doesNotExist();

        await fillIn('[data-test-input]', 'columnVisibleAndSearchable');
        await triggerKeyEvent('[data-test-input]', 'keyup', 'Enter');

        assert.dom('[data-test-cs-data-table]').exists();
        assert
          .dom('[data-test-row-index]')
          .exists({ count: 1 }, '1 row is displayed');
      });

      module('no result', () => {
        test('it display nothing if search give no result and we dont have table.noResult slot', async function (assert) {
          this.columns = [
            {
              key: 'id',
              hidden: false,
              searchable: true,
            },
          ];
          this.data = [
            {
              id: 'a',
            },
          ];

          await render(
            hbs`<CsDataTable @columns={{this.columns}} @data={{this.data}} as |table|>
                  <table.row as |row|>
                    <row.cell @key="id" as |item|>{{item.id}}</row.cell>
                  </table.row>
                </CsDataTable>`
          );

          assert.dom('[data-test-cs-data-table]').exists();
          assert
            .dom('[data-test-row-index]')
            .exists({ count: 1 }, '1 row is displayed');
          assert.dom('[data-test-empty="no-result"]').doesNotExist();

          await fillIn('[data-test-input]', 'test');
          await triggerKeyEvent('[data-test-input]', 'keyup', 'Enter');

          assert.dom('[data-test-cs-data-table]').exists();
          assert
            .dom('[data-test-row-index]')
            .doesNotExist('0 row is displayed');
          assert.dom('[data-test-empty="no-result"]').doesNotExist();
        });

        test('it display table.noResult if set and no result', async function (assert) {
          this.columns = [
            {
              key: 'id',
              hidden: false,
              searchable: true,
            },
          ];
          this.data = [
            {
              id: 'a',
            },
          ];

          await render(
            hbs`<CsDataTable @columns={{this.columns}} @data={{this.data}} as |table|>
                  <table.row as |row|>
                    <row.cell @key="id" as |item|>{{item.id}}</row.cell>
                  </table.row>
                  <table.noResult>No result found</table.noResult>
                </CsDataTable>`
          );

          assert.dom('[data-test-cs-data-table]').exists();
          assert
            .dom('[data-test-row-index]')
            .exists({ count: 1 }, '1 row is displayed');
          assert.dom('[data-test-empty="no-result"]').doesNotExist();

          await fillIn('[data-test-input]', 'test');
          await triggerKeyEvent('[data-test-input]', 'keyup', 'Enter');

          assert.dom('[data-test-cs-data-table]').exists();
          assert
            .dom('[data-test-row-index]')
            .doesNotExist('0 row is displayed');
          assert
            .dom('[data-test-empty="no-result"]')
            .hasText('No result found');
        });
      });
    });
  });
});
