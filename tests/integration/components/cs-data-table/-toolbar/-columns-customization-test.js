import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | cs-data-table/-toolbar/-columns-customization',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      this.columns = [];
      this.onCustomizingStart = () => {};

      await render(
        hbs`<CsDataTable::-Toolbar::-ColumnsCustomization @columns={{this.columns}} @onCustomizingStart={{this.onCustomizingStart}}/>`
      );

      assert.dom(this.element).hasText('Customize columns');
    });
  }
);
