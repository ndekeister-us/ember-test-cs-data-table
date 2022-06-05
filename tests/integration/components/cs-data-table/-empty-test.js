import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | cs-data-table/-empty', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(
      hbs`<CsDataTable::-Empty @nbCols="4">test</CsDataTable::-Empty>`
    );

    assert
      .dom('[data-test-empty]')
      .hasText('test')
      .hasClass('empty')
      .hasAttribute('colspan', '4');
  });
});
