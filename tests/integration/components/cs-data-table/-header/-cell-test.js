import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-test-cs-data-table/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | cs-data-table/-header/-cell',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });

      await render(hbs`<CsDataTable::Header::Cell />`);

      assert.dom(this.element).hasText('');

      // Template block usage:
      await render(hbs`
      <CsDataTable::Header::Cell>
        template block text
      </CsDataTable::Header::Cell>
    `);

      assert.dom(this.element).hasText('template block text');
    });
  }
);