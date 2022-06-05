import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | cs-data-table/-toolbar/-searchbar',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      this.searchableColumns = [
        {
          label: 'c1',
        },
        {
          label: 'c2',
        },
      ];

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
          'It will look for matches in following columns: c1, c2',
          'Searchable columns are listed correctly in the info element'
        );
      assert
        .dom('[data-test-input]')
        .hasValue('', 'Search value is empty by default');
      assert
        .dom('[data-test-clear]')
        .doesNotExist('Clear button is not displayed');
    });
  }
);
