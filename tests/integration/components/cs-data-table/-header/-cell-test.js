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
          .dom('[data-test-header-cell-move-left]')
          .hasText('<', 'Button have correct text')
          .hasAttribute(
            'title',
            'Move column to the left',
            'Button have correct title'
          );

        await click('[data-test-header-cell-move-left]');

        this.set('first', true);

        await settled();

        assert
          .dom('[data-test-header-cell-move-left]')
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
          .dom('[data-test-header-cell-move-right]')
          .hasText('>', 'Button have correct text')
          .hasAttribute(
            'title',
            'Move column to the right',
            'Button have correct title'
          );

        await click('[data-test-header-cell-move-right]');

        this.set('last', true);

        await settled();

        assert
          .dom('[data-test-header-cell-move-right]')
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
          .dom('[data-test-header-cell-visibility-checkbox]')
          .hasAria(
            'label',
            'Click to hide Some label column',
            'Correct aria-label is displayed'
          )
          .isChecked('Checkbox is checked as column is not hidden');

        await click('[data-test-header-cell-visibility-checkbox]');

        assert.true(this.column.hidden, 'Column is hidden');
        assert
          .dom('[data-test-header-cell-visibility-checkbox]')
          .isNotChecked('Checkbox is not checked as column is hidden');

        await click('[data-test-header-cell-visibility-checkbox]');

        assert.false(this.column.hidden, 'Column is not hidden');
        assert
          .dom('[data-test-header-cell-visibility-checkbox]')
          .isChecked('Checkbox is checked as column is not hidden');
      });
    });
  }
);
