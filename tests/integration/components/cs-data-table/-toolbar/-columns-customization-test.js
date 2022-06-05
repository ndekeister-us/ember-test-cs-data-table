import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { click, render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | cs-data-table/-toolbar/-columns-customization',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      this.noop = () => {};
    });

    test('it renders', async function (assert) {
      this.columns = [
        {
          hidden: false,
          isCustomized: false,
        },
      ];
      this.isCustomizingColumns = false;

      await render(
        hbs`<CsDataTable::-Toolbar::-Columns-customization
              @columns={{this.columns}}
              @isCustomizingColumns={{this.isCustomizingColumns}}
              @onResetColumns={{this.noop}}
              @onCustomizingEnd={{this.noop}}
              @onCustomizingStart={{this.noop}}
            />`
      );

      assert
        .dom('[data-test-columns-customization]')
        .hasClass(
          'cs-data-table-columns-customization',
          'Component have correct class'
        );

      assert
        .dom('[data-test-start]')
        .exists('Start button is displayed')
        .hasText('Customize columns');
      assert.dom('[data-test-end]').doesNotExist('End button is not displayed');
      assert
        .dom('[data-test-reset]')
        .doesNotExist('Reset button is not displayed');

      this.set('isCustomizingColumns', true);

      assert
        .dom('[data-test-start]')
        .doesNotExist('Start button is not displayed');
      assert
        .dom('[data-test-end]')
        .exists('End button is displayed')
        .hasText('Save');
      assert
        .dom('[data-test-reset]')
        .exists('Reset button is displayed')
        .hasText('Reset');
    });

    test('it calls @onCustomizingEnd on save', async function (assert) {
      this.columns = [
        {
          hidden: false,
          isCustomized: false,
        },
      ];
      this.isCustomizingColumns = true;
      this.onCustomizingEnd = () => {
        assert.step('onCustomizingEnd');
      };

      await render(
        hbs`<CsDataTable::-Toolbar::-Columns-customization
              @columns={{this.columns}}
              @isCustomizingColumns={{this.isCustomizingColumns}}
              @onResetColumns={{this.noop}}
              @onCustomizingEnd={{this.onCustomizingEnd}}
              @onCustomizingStart={{this.noop}}
            />`
      );

      assert.verifySteps([], 'onCustomizingEnd is not called yet');

      await click('[data-test-end]');

      assert.verifySteps(
        ['onCustomizingEnd'],
        'onCustomizingEnd is called once'
      );
    });

    test('it enable reset button if some columns are customized', async function (assert) {
      this.columns = [
        {
          hidden: false,
          isCustomized: false,
        },
      ];
      this.isCustomizingColumns = true;

      await render(
        hbs`<CsDataTable::-Toolbar::-Columns-customization
              @columns={{this.columns}}
              @isCustomizingColumns={{this.isCustomizingColumns}}
              @onResetColumns={{this.noop}}
              @onCustomizingEnd={{this.noop}}
              @onCustomizingStart={{this.noop}}
            />`
      );

      assert.dom('[data-test-reset]').isDisabled();

      this.set('columns', [
        {
          hidden: false,
          isCustomized: true,
        },
      ]);

      await settled();

      assert.dom('[data-test-reset]').isNotDisabled();
    });

    test('it calls @onResetColumns on reset', async function (assert) {
      this.columns = [
        {
          hidden: false,
          isCustomized: true,
        },
      ];
      this.isCustomizingColumns = true;
      this.onResetColumns = () => {
        assert.step('onResetColumns');
      };

      await render(
        hbs`<CsDataTable::-Toolbar::-Columns-customization
              @columns={{this.columns}}
              @isCustomizingColumns={{this.isCustomizingColumns}}
              @onResetColumns={{this.onResetColumns}}
              @onCustomizingEnd={{this.noop}}
              @onCustomizingStart={{this.noop}}
            />`
      );

      assert.verifySteps([], 'onResetColumns is not called yet');

      await click('[data-test-reset]');

      assert.verifySteps(['onResetColumns'], 'onResetColumns is called once');
    });

    test('it calls @onCustomizingStart when we start customization', async function (assert) {
      this.columns = [
        {
          hidden: false,
          isCustomized: false,
        },
      ];
      this.isCustomizingColumns = false;
      this.onCustomizingStart = () => {
        assert.step('onCustomizingStart');
      };

      await render(
        hbs`<CsDataTable::-Toolbar::-Columns-customization
              @columns={{this.columns}}
              @isCustomizingColumns={{this.isCustomizingColumns}}
              @onResetColumns={{this.noop}}
              @onCustomizingEnd={{this.noop}}
              @onCustomizingStart={{this.onCustomizingStart}}
            />`
      );

      assert.verifySteps([], 'onCustomizingStart is not called yet');

      await click('[data-test-start]');

      assert.verifySteps(
        ['onCustomizingStart'],
        'onCustomizingStart is called once'
      );
    });

    test('it calls @onCustomizingStart on reset', async function (assert) {
      this.columns = [
        {
          hidden: false,
          isCustomized: false,
        },
      ];
      this.isCustomizingColumns = false;
      this.onCustomizingStart = () => {
        assert.step('onCustomizingStart');
      };

      await render(
        hbs`<CsDataTable::-Toolbar::-Columns-customization
              @columns={{this.columns}}
              @isCustomizingColumns={{this.isCustomizingColumns}}
              @onResetColumns={{this.noop}}
              @onCustomizingEnd={{this.noop}}
              @onCustomizingStart={{this.onCustomizingStart}}
            />`
      );

      assert.verifySteps([], 'onCustomizingStart is not called yet');

      await click('[data-test-start]');

      assert.verifySteps(
        ['onCustomizingStart'],
        'onCustomizingStart is called once'
      );
    });

    test('it display number of hidden columns in start button', async function (assert) {
      this.columns = [
        {
          hidden: false,
          isCustomized: false,
        },
      ];
      this.isCustomizingColumns = false;

      await render(
        hbs`<CsDataTable::-Toolbar::-Columns-customization
              @columns={{this.columns}}
              @isCustomizingColumns={{this.isCustomizingColumns}}
              @onResetColumns={{this.noop}}
              @onCustomizingEnd={{this.noop}}
              @onCustomizingStart={{this.noop}}
            />`
      );

      assert.dom('[data-test-start]').hasText('Customize columns');

      this.set('columns', [
        {
          hidden: true,
          isCustomized: false,
        },
      ]);

      await settled();

      assert.dom('[data-test-start]').hasText('Customize columns (1 hidden)');
    });
  }
);
