import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | cs-data-table/-empty', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(
      hbs`<CsDataTable::-Empty @nbCols="4" data-pass-attributes="test" @type="test">test</CsDataTable::-Empty>`
    );

    assert
      .dom('td[data-test-empty="test"]')
      .hasText('test', 'It yield content correctly')
      .hasClass('empty', 'Cell have correct class')
      .hasAttribute('colspan', '4', 'Cell colspan equals @nbCols')
      .hasAttribute(
        'data-pass-attributes',
        'test',
        'It pass attributes correctly'
      );
  });
});
