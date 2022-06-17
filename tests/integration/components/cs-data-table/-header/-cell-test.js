import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { click, render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | cs-data-table/-header/-cell',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      this.column = {
        key: 'test',
        hidden: false,
        label: 'Some label',
        order: 4,
      };
      this.noop = () => {};
    });

    test('it renders correctly when column is visible and @isCustomizingColumns is false', async function (assert) {
      await render(
        hbs`<CsDataTable::-Header::-Cell @column={{this.column}} @first={{false}} @index="3" @isCustomizingColumns={{false}} />`
      );

      assert
        .dom('th[data-test-header-cell-index="3"]')
        .hasAttribute('data-test-header-cell-key', 'test')
        .hasText('Some label', 'It display column label');
    });

    test('it dont display when @column is hidden and @isCustomizingColumns is false', async function (assert) {
      await render(
        hbs`<CsDataTable::-Header::-Cell @column={{this.column}} @index="3" @isCustomizingColumns={{false}} />`
      );

      assert
        .dom('th[data-test-header-cell-index="3"]')
        .exists('Cell is displayed');

      this.set('column.hidden', true);

      await settled();

      assert
        .dom('th[data-test-header-cell-index="3"]')
        .doesNotExist('Cell is not displayed');
    });

    test('it display when @column is hidden and @isCustomizingColumns is true', async function (assert) {
      this.set('column.hidden', true);
      this.isCustomizingColumns = false;

      await render(
        hbs`<CsDataTable::-Header::-Cell
            @column={{this.column}}
            @index="2"
            @isCustomizingColumns={{this.isCustomizingColumns}}
            @onMove={{this.noop}}
            @onToggleVisibility={{this.noop}}
          />`
      );

      assert
        .dom('th[data-test-header-cell-index="2"]')
        .doesNotExist('Cell is not displayed');

      this.set('isCustomizingColumns', true);

      await settled();

      assert
        .dom('th[data-test-header-cell-index="2"]')
        .exists('Cell is displayed');
    });

    test('display sortable column correctly', async function (assert) {
      this.onSort = () => {
        assert.step('onSort');
      };
      this.set('column.sortable', false);
      this.isCustomizingColumns = false;
      this.sortColumnKey = '';
      this.sortDirection = 'asc';

      await render(
        hbs`<CsDataTable::-Header::-Cell
            @column={{this.column}}
            @columnKey
            @index="2"
            @isCustomizingColumns={{this.isCustomizingColumns}}
            @sortColumnKey={{this.sortColumnKey}}
            @sortDirection={{this.sortDirection}}
            @onMove={{this.noop}}
            @onSort={{this.onSort}}
            @onToggleVisibility={{this.noop}}
          />`
      );

      // Column is not sortable
      assert
        .dom('th')
        .doesNotHaveAria(
          'sort',
          'aria-sort is not added when column is not sortable'
        );

      assert
        .dom('[data-test-sort-button]')
        .doesNotExist('sortable button dont exist when column is not sortable');

      // Column is sortable
      this.set('column.sortable', true);
      await settled();

      assert
        .dom('th')
        .hasAria(
          'sort',
          'none',
          'aria-sort is correctly set when column is sortable'
        );

      assert
        .dom('[data-test-sort-button] [data-test-label]')
        .hasText('Some label', 'Label is displayed inside button');
      assert
        .dom('[data-test-sort-button] [data-test-sort-direction]')
        .doesNotExist('Sort icon is not displayed as column is not sorted');

      // Column is sortable and sorted in ascending order
      this.set('sortColumnKey', this.column.key);
      this.set('sortDirection', 'asc');

      await settled();

      assert
        .dom('th')
        .hasAria(
          'sort',
          'ascending',
          'aria-sort is correctly when column is sorted in ascending order'
        );
      assert
        .dom('[data-test-sort-button] [data-test-sort-direction]')
        .hasText(
          '⇡',
          'We have sort by descending icon in sort button when column is sorted in ascending order'
        );

      // Column is sortable and sorted in descending order
      this.set('sortColumnKey', this.column.key);
      this.set('sortDirection', 'desc');

      await settled();

      assert
        .dom('th')
        .hasAria(
          'sort',
          'descending',
          'aria-sort is correctly when column is sorted in descending order'
        );
      assert
        .dom('[data-test-sort-button] [data-test-sort-direction]')
        .hasText(
          '⇣',
          'We have sort by ascending icon in sort button when column is sorted in descending order'
        );

      assert.verifySteps([]);

      await click('[data-test-sort-button]');

      assert.verifySteps(['onSort'], 'It calls onSort correctly');
    });

    module('with @isCustomizingColumns set to true', () => {
      test('moveToLeft button', async function (assert) {
        assert.expect(5);

        this.first = false;
        this.onMove = (column, newOrder) => {
          assert.strictEqual(
            column,
            this.column,
            'It calls @onMove with @column'
          );
          assert.strictEqual(
            newOrder,
            this.column.order - 1,
            'It calls @onMove with correct order'
          );
        };

        await render(
          hbs`<CsDataTable::-Header::-Cell
            @column={{this.column}}
            @first={{this.first}}
            @index={{this.column.order}}
            @isCustomizingColumns={{true}}
            @last={{false}}
            @onMove={{this.onMove}}
            @onToggleVisibility={{this.noop}}
          />`
        );

        assert
          .dom('[data-test-move-left]')
          .hasText('<', 'Button have correct text')
          .hasAttribute(
            'title',
            'Move column to the left',
            'Button have correct title'
          );

        await click('[data-test-move-left]');

        this.set('first', true);

        await settled();

        assert
          .dom('[data-test-move-left]')
          .doesNotExist('Button is not displayed when column is the first one');
      });

      test('moveToRight button', async function (assert) {
        assert.expect(5);

        this.last = false;
        this.onMove = (column, newOrder) => {
          assert.strictEqual(
            column,
            this.column,
            'It calls @onMove with @column'
          );
          assert.strictEqual(
            newOrder,
            this.column.order + 1,
            'It calls @onMove with correct order'
          );
        };

        await render(
          hbs`<CsDataTable::-Header::-Cell
            @column={{this.column}}
            @first={{false}}
            @index={{this.column.order}}
            @isCustomizingColumns={{true}}
            @last={{this.last}}
            @onMove={{this.onMove}}
            @onToggleVisibility={{this.noop}}
          />`
        );

        assert
          .dom('[data-test-move-right]')
          .hasText('>', 'Button have correct text')
          .hasAttribute(
            'title',
            'Move column to the right',
            'Button have correct title'
          );

        await click('[data-test-move-right]');

        this.set('last', true);

        await settled();

        assert
          .dom('[data-test-move-right]')
          .doesNotExist('Button is not displayed when column is the last one');
      });

      test('visibility checkbox', async function (assert) {
        assert.expect(6);

        this.onToggleVisibility = (hidden) => {
          this.set('column.hidden', hidden);
        };

        await render(
          hbs`<CsDataTable::-Header::-Cell
            @column={{this.column}}
            @first={{false}}
            @index={{this.column.order}}
            @isCustomizingColumns={{true}}
            @last={{false}}
            @onMove={{this.noop}}
            @onToggleVisibility={{this.onToggleVisibility}}
          />`
        );

        assert
          .dom('[data-test-visibility-checkbox]')
          .hasAria(
            'label',
            'Click to hide Some label column',
            'Correct aria-label is displayed'
          )
          .isChecked('Checkbox is checked as column is not hidden');

        await click('[data-test-visibility-checkbox]');

        assert.true(this.column.hidden, 'Column is hidden');
        assert
          .dom('[data-test-visibility-checkbox]')
          .isNotChecked('Checkbox is not checked as column is hidden');

        await click('[data-test-visibility-checkbox]');

        assert.false(this.column.hidden, 'Column is not hidden');
        assert
          .dom('[data-test-visibility-checkbox]')
          .isChecked('Checkbox is checked as column is not hidden');
      });
    });
  }
);
