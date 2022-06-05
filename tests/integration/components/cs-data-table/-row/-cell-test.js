import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | cs-data-table/-row/-cell', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders when @column key equals @key', async function (assert) {
    this.column = {
      key: 'col1',
    };
    this.item = {
      text: 'test',
    };

    await render(
      hbs`<CsDataTable::-Row::-Cell class="test" @column={{this.column}} @index="3" @item={{this.item}} @key="col1" as |item|>{{item.text}}</CsDataTable::-Row::-Cell>`
    );

    assert
      .dom('td[data-test-cell-index="3"]')
      .hasClass('test', 'It pass attributes to td')
      .hasText('test');
  });

  test('it dont display when @column key different to @key', async function (assert) {
    this.column = {
      key: 'col1',
    };
    this.key = 'col1';

    await render(
      hbs`<CsDataTable::-Row::-Cell @column={{this.column}} @index="3" @key={{this.key}} as |item|></CsDataTable::-Row::-Cell>`
    );

    assert
      .dom('td[data-test-cell-index="3"]')
      .exists('Cell is displayed when @column key equals @key');

    this.set('key', 'col2');

    await settled();

    assert
      .dom('td[data-test-cell-index="3"]')
      .doesNotExist(
        'Cell is not displayed when @column key is different to @key'
      );
  });

  test('cell should be visible when @column is hidden and @isCustomizingColumns is true', async function (assert) {
    this.column = {
      key: 'col1',
      hidden: true,
    };
    this.isCustomizingColumns = false;

    await render(
      hbs`<CsDataTable::-Row::-Cell @column={{this.column}} @index="3" @isCustomizingColumns={{this.isCustomizingColumns}} @key="col1" as |item|></CsDataTable::-Row::-Cell>`
    );

    assert
      .dom('td[data-test-cell-index="3"]')
      .doesNotExist('Cell is not displayed');

    this.set('isCustomizingColumns', true);

    await settled();

    assert.dom('td[data-test-cell-index="3"]').exists('Cell is displayed');
  });

  test('cell should be hidden when @column is hidden and @isCustomizingColumns is false', async function (assert) {
    this.column = {
      key: 'col1',
      hidden: false,
    };
    this.isCustomizingColumns = false;

    await render(
      hbs`<CsDataTable::-Row::-Cell @column={{this.column}} @index="3" @isCustomizingColumns={{this.isCustomizingColumns}} @key="col1" as |item|></CsDataTable::-Row::-Cell>`
    );

    assert.dom('td[data-test-cell-index="3"]').exists('Cell is displayed');

    this.set('column.hidden', true);

    await settled();

    assert
      .dom('td[data-test-cell-index="3"]')
      .doesNotExist('Cell is not displayed');
  });
});
