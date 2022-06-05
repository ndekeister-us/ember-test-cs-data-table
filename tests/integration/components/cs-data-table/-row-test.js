import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | cs-data-table/-row', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(
      hbs`<CsDataTable::-Row class="test" @index="1" as |row|></CsDataTable::-Row>`
    );

    assert
      .dom('tr[data-test-row-index="1"]')
      .hasClass('test', 'It pass attributes to tr');
  });
});
