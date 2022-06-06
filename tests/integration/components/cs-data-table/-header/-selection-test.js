import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { click, find, render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | cs-data-table/-header/-selection',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders correctly', async function (assert) {
      this.nbItems = 10;
      this.nbSelectedItems = 0;
      this.onToggleSelection = () => {};

      await render(
        hbs`<CsDataTable::-Header::-Selection @nbItems={{this.nbItems}} @nbSelectedItems={{this.nbSelectedItems}} @onToggleSelection={{this.onToggleSelection}} />`
      );

      assert
        .dom('th')
        .hasAttribute(
          'data-test-header-selection',
          '',
          'th have correct data-test attribute'
        );

      // No items selected
      assert
        .dom('[data-test-selection-checkbox]')
        .isNotChecked()
        .hasAttribute('title', 'Select all items')
        .hasAria('label', 'Select all items');

      let checkbox = find('[data-test-selection-checkbox]');
      assert.false(
        checkbox.indeterminate,
        'Checkbox is not in indeterminate state'
      );

      this.set('nbSelectedItems', 1);

      await settled();

      // Some items selected
      assert
        .dom('[data-test-selection-checkbox]')
        .isNotChecked()
        .hasAttribute('title', 'Select all items')
        .hasAria('label', 'Select all items');

      checkbox = find('[data-test-selection-checkbox]');
      assert.true(checkbox.indeterminate, 'Checkbox is in indeterminate state');

      this.set('nbSelectedItems', this.nbItems);

      // All items selected
      assert
        .dom('[data-test-selection-checkbox]')
        .isChecked()
        .hasAttribute('title', 'Unselect all items')
        .hasAria('label', 'Unselect all items');

      checkbox = find('[data-test-selection-checkbox]');
      assert.false(
        checkbox.indeterminate,
        'Checkbox is not in indeterminate state'
      );
    });

    test('it disable checkbox', async function (assert) {
      this.disabled = false;
      this.nbItems = 10;
      this.nbSelectedItems = 0;
      this.onToggleSelection = () => {};

      await render(
        hbs`<CsDataTable::-Header::-Selection @disabled={{this.disabled}} @nbItems={{this.nbItems}} @nbSelectedItems={{this.nbSelectedItems}} @onToggleSelection={{this.onToggleSelection}} />`
      );

      assert.dom('[data-test-selection-checkbox]').isNotDisabled();

      this.set('disabled', true);

      await settled();

      assert.dom('[data-test-selection-checkbox]').isDisabled();
    });

    test('it calls @onToggleSelection on click', async function (assert) {
      this.nbItems = 10;
      this.nbSelectedItems = 0;
      this.onToggleSelection = () => {
        assert.step('onToggleSelection');
      };

      await render(
        hbs`<CsDataTable::-Header::-Selection @nbItems={{this.nbItems}} @nbSelectedItems={{this.nbSelectedItems}} @onToggleSelection={{this.onToggleSelection}} />`
      );

      assert.verifySteps([]);

      await click('[data-test-selection-checkbox]');

      assert.verifySteps(['onToggleSelection']);
    });
  }
);
