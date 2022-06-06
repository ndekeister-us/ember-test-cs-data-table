import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { click, render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { tracked } from '@glimmer/tracking';

class Item {
  @tracked _selected = false;
}

module(
  'Integration | Component | cs-data-table/-row/-selection',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      this.item = new Item();
      this.onItemSelectionChange = () => {};

      await render(
        hbs`<CsDataTable::-Row::-Selection @item={{this.item}} @onItemSelectionChange={{this.onItemSelectionChange}} />`
      );

      assert
        .dom('td')
        .hasAttribute(
          'data-test-cell-selection',
          '',
          'td have correct data-test attribute'
        );

      // Item not selected
      assert
        .dom('[data-test-selection-checkbox]')
        .isNotChecked()
        .hasAttribute('title', 'Select')
        .hasAria('label', 'Select');

      this.item._selected = true;

      await settled();

      // Item selected
      assert
        .dom('[data-test-selection-checkbox]')
        .isChecked()
        .hasAttribute('title', 'Unselect')
        .hasAria('label', 'Unselect');
    });

    test('it calls @onItemSelectionChange with correct value', async function (assert) {
      assert.expect(2);

      this.item = new Item();
      this.onItemSelectionChange = (selected) => {
        assert.strictEqual(
          selected,
          !this.item._selected,
          '@onItemSelectionChange is called with !this.item._selected'
        );
      };

      await render(
        hbs`<CsDataTable::-Row::-Selection @item={{this.item}} @onItemSelectionChange={{this.onItemSelectionChange}} />`
      );

      await click('[data-test-selection-checkbox]');

      await click('[data-test-selection-checkbox]');
    });
  }
);
