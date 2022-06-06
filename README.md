# ember-test-cs-data-table

:warning: This is a technical test for a job opportunity, you should not use this addon in production :warning:

It provides a `<CsDataTable>` component allowing to display data in a table with following features
- search on some columns
- columns customization, end-user can
  - re-order columns
  - manage columns visibility (hide or display some columns)
- fully customizable cell content (you can easily use your own components)
- customize display of "empty data" and "no search results" state
- rows selection
- custom actions on selected rows

## Demo

https://user-images.githubusercontent.com/56396753/172071156-0f825892-30a0-4f5f-88f4-22c6d8860ab0.mov


## Compatibility

* Ember.js v3.24 or above
* Ember CLI v3.24 or above
* Node.js v14 or above


## Installation

:warning: This is a technical test for a job opportunity, you should not use this addon in production :warning:

## Usage

`CsDataTable` take two mandatory arguments `@columns` and `@data`

`@columns` is an array of columns with following properties
| Property      | Required    | Description                                                                               |
| ------------- | ----------- | ----------------------------------------------------------------------------------------- |
| `key`         | true        | Column identifier, used to match corresponding cell in `<table.row>`                      |
| `label`       | false       | Text to display for the column, if not set `key` will be used                             |
| `hidden`      | false       | When set to `true` column will be hidden                                                  |
| `searchable`  | false       | When set to `true` it will allow filtering on this column (if column is not hidden)         |
| `searchKey`   | false       | Default to `key`, override if you want to target a specific property of your data object  |

`@data` is an array of items to display

You can set three optional arguments
- `@allowColumnsCustomization` (`boolean`), when set to `true` will display customizations button to the end-user, allowing him to manage column visibility and order
- `@allowSelection` (`boolean`), when set to `true` will allow row selection
- `@debounce` (`number` of milliseconds) allowing to debounce the search by `x`ms (by default `300`ms)

### Basic usage

Display some columns + data
```hbs
<CsDataTable @columns={{this.columns}} @data={{this.data}} as |table|>
  <table.empty>
    There is no data to display
  </table.empty>
  <table.row as |row|>
    <row.cell @key="id" as |item|>{{item.id}}</row.cell>
    <row.cell @key="name" as |item|>{{item.name}}</row.cell>
    <row.cell @key="amount" as |item|>{{item.amount}}</row.cell>
    <row.cell @key="allProperties" as |item|><YourComponent @item={{item}} /></row.cell>
  </table.row>
</CsDataTable>
```

<details><summary>Click to see JS code</summary>

```js
import Component from '@glimmer/component';

export default class ExampleComponent extends Component {
  get columns() {
    return [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'name',
        label: 'Name',
      },
      {
        key: 'amount',
        label: 'Amount',
      },
      {
        key: 'allProperties',
      },
    ];
  }

  get data() {
    return [
      {
        id: 1,
        name: 'Name 1',
        amount: 10,
      },
      {
        id: 2,
        name: 'Name 2',
        amount: 20,
      },
    ];
  }
}
```
</details>

### Advanced usage

All features
- display columns
  - hide `amount` column by default 
- display data in different way (yielding props / using components, via `<row.cell>`)
- enable columns customization (via `@allowColumnsCustomization`)
  - ordering
  - visibility management
- slot no data message (via `<table.empty>`)
- enable filtering on `id` and `name` columns
  - set search debounce value to 200m via `@debounce`
  - slot no result message (via `<table.noResult>`)
- enable rows selection (via `@allowSelection`)
  - loads with one row pre-selected
- enable custom action on selected rows (via `<table.toolbarActions>`)

```hbs
<CsDataTable @allowColumnsCustomization="true" @allowSelection="true" @columns={{this.columns}} @data={{this.data}} @debounce="100" as |table|>
  <table.toolbarActions as |selectedItems|>
    <button type="button" disabled={{lt selectedItems.length 1}} {{on "click" (fn this.myAction selectedItems)}}>My action on selected items</button>
  </table.toolbarActions>
  <table.empty>
    There is no data to display
  </table.empty>
  <table.noResult>
    Nothing match your criteria. Try using different search terms
  </table.noResult>
  <table.row as |row|>
    <row.cell @key="id" as |item|>{{item.id}}</row.cell>
    <row.cell @key="name" as |item|>{{item.name}}</row.cell>
    <row.cell @key="amount" as |item|>{{item.amount}}</row.cell>
    <row.cell @key="allProperties" as |item|><YourComponent @item={{item}} /></row.cell>
  </table.row>
</CsDataTable>
```

<details><summary>Click to see JS code</summary>

```js
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ExampleComponent extends Component {
  get columns() {
    return [
      {
        key: 'id',
        label: 'ID',
        searchable: true,
      },
      {
        key: 'name',
        label: 'Name',
        searchable: true,
      },
      {
        key: 'amount',
        label: 'Amount',
        hidden: true,
      },
      {
        key: 'allProperties',
      },
    ];
  }

  get data() {
    return [
      {
        id: 1,
        name: 'Name 1',
        amount: 10,
      },
      {
        id: 2,
        name: 'Name 2',
        amount: 20,
        _selected: true,
      },
    ];
  }
	
	@action
  myAction(selectedItems) {
    console.log('selectedItems', selectedItems)
  }
}
```
</details>

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
