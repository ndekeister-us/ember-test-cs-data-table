import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  click,
  fillIn,
  render,
  triggerKeyEvent,
  settled,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | cs-data-table/-toolbar/-searchbar',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      this.searchableColumns = [
        {
          label: 'col1',
        },
        {
          label: 'col2',
        },
      ];
    });

    test('it renders', async function (assert) {
      await render(
        hbs`<CsDataTable::-Toolbar::-Searchbar @searchableColumns={{this.searchableColumns}} />`
      );

      assert
        .dom('[data-test-searchbar] ')
        .hasClass('cs-data-table-searchbar', 'Component have correct class');
      assert
        .dom('[data-test-info]')
        .hasAttribute(
          'title',
          'It will look for matches in following columns: col1, col2',
          'Searchable columns are listed correctly in the info element'
        );
      assert
        .dom('[data-test-input]')
        .hasValue('', 'Search value is empty by default');
      assert
        .dom('[data-test-clear]')
        .doesNotExist('Clear button is not displayed');
    });

    test('it update info tooltip on @searchableColumns change', async function (assert) {
      await render(
        hbs`<CsDataTable::-Toolbar::-Searchbar @searchableColumns={{this.searchableColumns}} />`
      );

      assert
        .dom('[data-test-info]')
        .hasAttribute(
          'title',
          'It will look for matches in following columns: col1, col2'
        );

      this.set('searchableColumns', [
        {
          label: 'col3',
        },
      ]);

      await settled();

      assert
        .dom('[data-test-info]')
        .hasAttribute(
          'title',
          'It will look for matches in following columns: col3',
          'Info element is correctly updated'
        );
    });

    test('it initialize with a search value', async function (assert) {
      await render(
        hbs`<CsDataTable::-Toolbar::-Searchbar @searchableColumns={{this.searchableColumns}} @value="test" />`
      );

      assert.dom('[data-test-input]').hasValue('test');
    });

    test('it perform a search then clear value correctly', async function (assert) {
      this.value = '';

      await render(
        hbs`<CsDataTable::-Toolbar::-Searchbar @onSearch={{fn (mut this.value)}} @searchableColumns={{this.searchableColumns}} @value={{this.value}} />`
      );

      await fillIn('[data-test-input]', 'test');
      await triggerKeyEvent('[data-test-input]', 'keyup', 'Enter');

      assert
        .dom('[data-test-input]')
        .hasValue('test', 'Correct value is displayed in the input');
      assert.strictEqual(
        this.value,
        'test',
        'this.value is update correctly via @onSearch'
      );

      await click('[data-test-clear]');

      assert.dom('[data-test-input]').hasValue('', 'Input is now empty');
      assert.strictEqual(this.value, '');
    });
  }
);
