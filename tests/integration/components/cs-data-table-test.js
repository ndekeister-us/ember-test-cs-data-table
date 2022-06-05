import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | cs-data-table', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders nothing when we pass empty columns', async function (assert) {
    this.columns = [];
    this.data = [];
    await render(
      hbs`<CsDataTable @columns={{this.columns}} @data={{this.data}} />`
    );

    assert.dom('[data-test-cs-data-table]').doesNotExist();
  });
});
