import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | cs-data-table/-toolbar/-actions',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      this.selectedItems = [1, 2];
      await render(
        hbs`<CsDataTable::-Toolbar::-Actions @selectedItems={{this.selectedItems}}>test</CsDataTable::-Toolbar::-Actions>`
      );

      assert
        .dom('[data-test-actions]')
        .hasClass('cs-data-table-actions')
        .hasText('test', 'it yields correctly');
    });
  }
);
