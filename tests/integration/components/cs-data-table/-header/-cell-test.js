import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | cs-data-table/-header/-cell',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      await render(hbs`<CsDataTable::-Header::-Cell />`);

      assert.dom(this.element).hasText('');
    });
  }
);
