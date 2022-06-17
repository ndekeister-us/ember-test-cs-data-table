import { module, test } from 'qunit';
import { click, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'dummy/tests/helpers';

module('Acceptance | application', function (hooks) {
  setupApplicationTest(hooks);

  module('financial data-table', () => {
    test('it renders correctly', async function (assert) {
      await visit('/');

      assert.dom('[data-test-financial-data-table]').exists();

      // Demo actions
      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-data]'
        )
        .hasText('Clear data');
      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-filtering]'
        )
        .hasText('Disable filtering');
      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-customization]'
        )
        .hasText('Disable columns customization');
      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-selection]'
        )
        .hasText('Disable selection');

      // Data-table content
      assert
        .dom(
          '[data-test-financial-data-table] [data-test-columns-customization]'
        )
        .exists('Customization is displayed in data-table');
      assert
        .dom('[data-test-financial-data-table] [data-test-searchbar]')
        .exists('Searchbar is displayed in data-table');
      assert
        .dom(
          '[data-test-financial-data-table] [data-test-header-selection] [data-test-selection-checkbox]'
        )
        .exists('Global checkbox is displayed')
        .isNotChecked();
      assert
        .dom('[data-test-financial-data-table] [data-test-header-cell-index]')
        .exists({ count: 7 });

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-header-cell-key="id"]'
        )
        .hasAttribute('data-test-header-cell-index', '0')
        .hasText('ID')
        .hasAria('sort', 'none', 'Column is sortable but not sorted yet');

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-header-cell-key="name"]'
        )
        .hasAttribute('data-test-header-cell-index', '1')
        .hasText('Name')
        .hasAria('sort', 'none', 'Column is sortable but not sorted yet');

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-header-cell-key="amount"]'
        )
        .hasAttribute('data-test-header-cell-index', '2')
        .hasText('⇣ Amount')
        .hasAria(
          'sort',
          'descending',
          'Column is sorted by default in desc order'
        );

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-header-cell-key="strangeKey"]'
        )
        .hasAttribute('data-test-header-cell-index', '3')
        .hasText('Email')
        .hasAria('sort', 'none', 'Column is sortable but not sorted yet');

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-header-cell-key="strangeKey2"]'
        )
        .hasAttribute('data-test-header-cell-index', '4')
        .hasText('Credit card issuer')
        .hasAria('sort', 'none', 'Column is sortable but not sorted yet');

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-header-cell-key="creditCardNumber"]'
        )
        .hasAttribute('data-test-header-cell-index', '5')
        .hasText('Credit card number')
        .doesNotHaveAria('sort', 'Column is not sortable');

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-header-cell-key="creditCardExpirationDate"]'
        )
        .doesNotExist('Column is not displayed');

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-header-cell-key="actions"]'
        )
        .hasAttribute('data-test-header-cell-index', '7')
        .hasText('Sensible data')
        .doesNotHaveAria('sort', 'Column is not sortable');
    });

    test('it clear and populate data correctly', async function (assert) {
      await visit('/');

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-data]'
        )
        .hasText('Clear data');
      assert
        .dom('[data-test-financial-data-table] [data-test-row-index]')
        .exists({ count: 10 });
      assert
        .dom('[data-test-financial-data-table] [data-test-empty="empty"]')
        .doesNotExist();
      assert
        .dom('[data-test-financial-data-table] [data-test-searchbar]')
        .exists('Searchbar is displayed in data-table');

      // Clear data
      await click(
        '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-data]'
      );

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-data]'
        )
        .hasText('Populate with data');
      assert
        .dom('[data-test-financial-data-table] [data-test-row-index]')
        .doesNotExist();
      assert
        .dom('[data-test-financial-data-table] [data-test-empty="empty"]')
        .hasText('There is no data to display');
      assert
        .dom('[data-test-financial-data-table] [data-test-searchbar]')
        .doesNotExist('Searchbar is not displayed anymore as we have no data');

      // Populate data
      await click(
        '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-data]'
      );

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-data]'
        )
        .hasText('Clear data');
      assert
        .dom('[data-test-financial-data-table] [data-test-row-index]')
        .exists({ count: 10 });
      assert
        .dom('[data-test-financial-data-table] [data-test-empty="empty"]')
        .doesNotExist();
      assert
        .dom('[data-test-financial-data-table] [data-test-searchbar]')
        .exists('Searchbar is displayed again as we have data');
    });

    test('it enable and disable filtering correctly', async function (assert) {
      await visit('/');

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-filtering]'
        )
        .hasText('Disable filtering');
      assert
        .dom('[data-test-financial-data-table] [data-test-searchbar]')
        .exists('Searchbar is displayed in data-table');

      // Disable filtering
      await click(
        '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-filtering]'
      );

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-filtering]'
        )
        .hasText('Enable filtering');
      assert
        .dom('[data-test-financial-data-table] [data-test-searchbar]')
        .doesNotExist(
          'Searchbar is not displayed anymore as filtering is disabled'
        );

      // Enable filtering
      await click(
        '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-filtering]'
      );

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-filtering]'
        )
        .hasText('Disable filtering');
      assert
        .dom('[data-test-financial-data-table] [data-test-searchbar]')
        .exists('Searchbar is displayed again as filtering is enabled');
    });

    test('it enable and disable sorting correctly', async function (assert) {
      await visit('/');

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-sorting]'
        )
        .hasText('Disable sorting');
      assert
        .dom(
          '[data-test-financial-data-table] [data-test-header-cell-index] [data-test-sort-button]'
        )
        .exists({ count: 5 }, 'We have correct number of sortable columns');

      // Disable sorting
      await click(
        '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-sorting]'
      );

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-sorting]'
        )
        .hasText('Enable sorting');
      assert
        .dom(
          '[data-test-financial-data-table] [data-test-header-cell-index] [data-test-sort-button]'
        )
        .doesNotExist('We dont have any sortable columns');

      // Enable sorting
      await click(
        '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-sorting]'
      );

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-sorting]'
        )
        .hasText('Disable sorting');
      assert
        .dom(
          '[data-test-financial-data-table] [data-test-header-cell-index] [data-test-sort-button]'
        )
        .exists({ count: 5 }, 'We have correct number of sortable columns');
    });

    test('it enable and disable columns customization correctly', async function (assert) {
      await visit('/');

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-customization]'
        )
        .hasText('Disable columns customization');
      assert
        .dom(
          '[data-test-financial-data-table] [data-test-columns-customization]'
        )
        .exists('Columns customization element is displayed in data-table');

      // Disable customization
      await click(
        '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-customization]'
      );

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-customization]'
        )
        .hasText('Enable columns customization');
      assert
        .dom(
          '[data-test-financial-data-table] [data-test-columns-customization]'
        )
        .doesNotExist('Columns customization element is not displayed anymore');

      // Enable customization
      await click(
        '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-customization]'
      );

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-customization]'
        )
        .hasText('Disable columns customization');
      assert
        .dom(
          '[data-test-financial-data-table] [data-test-columns-customization]'
        )
        .exists('Columns customization element is displayed again');
    });

    test('it enable and disable selecton correctly', async function (assert) {
      await visit('/');

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-selection]'
        )
        .hasText('Disable selection');
      assert
        .dom('[data-test-financial-data-table] [data-test-header-selection]')
        .exists('Selection element is displayed in data-table');

      // Disable selection
      await click(
        '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-selection]'
      );

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-selection]'
        )
        .hasText('Enable selection');
      assert
        .dom('[data-test-financial-data-table] [data-test-header-selection]')
        .doesNotExist('Selection element is not displayed anymore');

      // Enable selection
      await click(
        '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-selection]'
      );

      assert
        .dom(
          '[data-test-financial-data-table] [data-test-demo-actions] [data-test-toggle-selection]'
        )
        .hasText('Disable selection');
      assert
        .dom('[data-test-financial-data-table] [data-test-header-selection]')
        .exists('Selection element is displayed again');
    });
  });
});
