import Component from '@glimmer/component';
import { faker } from '@faker-js/faker';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ExampleFinanceComponent extends Component {
  @tracked allowColumnsCustomization = true;

  @tracked allowSelection = true;

  @tracked enableFiltering = true;

  @tracked enableSorting = true;

  @tracked searchDebounce = '500';

  get columns() {
    return [
      {
        key: 'id',
        label: 'ID',
        searchable: this.enableFiltering,
        sortable: this.enableSorting,
      },
      {
        key: 'name',
        label: 'Name',
        searchable: this.enableFiltering,
        sortable: this.enableSorting,
      },
      {
        key: 'amount',
        label: 'Amount',
        sortable: this.enableSorting,
        initialSort: 'desc',
        sortFn: ({ amount: a }, { amount: b }, direction) => {
          if (direction === 'asc') {
            return a - b;
          } else {
            return b - a;
          }
        },
      },
      {
        key: 'strangeKey',
        label: 'Email',
        searchable: this.enableFiltering,
        searchKey: 'email',
        sortable: this.enableSorting,
        sortFn: ({ email: a }, { email: b }, direction) => {
          let _a = a.split('@')[0];
          let _b = b.split('@')[0];
          if (direction === 'asc') {
            return _a.localeCompare(_b);
          } else {
            return _b.localeCompare(_a);
          }
        },
      },
      {
        key: 'strangeKey2',
        label: 'Credit card issuer',
        searchable: this.enableFiltering,
        searchKey: 'creditCardIssuer',
        sortable: this.enableSorting,
        sortKey: 'creditCardIssuer',
      },
      {
        key: 'creditCardNumber',
        label: 'Credit card number',
        searchable: this.enableFiltering,
      },
      {
        key: 'creditCardExpirationDate',
        label: 'Credit card expiration date',
        searchable: this.enableFiltering,
        hidden: true,
      },
      {
        key: 'actions',
        label: 'Sensible data',
      },
    ];
  }

  fullData = [...Array(10).keys()].map(() => {
    const expirationDate = faker.date.future();
    return {
      id: faker.finance.account(),
      name: faker.finance.accountName(),
      amount: faker.finance.amount(),
      email: faker.internet.exampleEmail(),
      creditCardCVV: faker.finance.creditCardCVV(),
      creditCardExpirationDate: `${('0' + expirationDate.getDate()).slice(
        -2
      )}/${('0' + (expirationDate.getMonth() + 1)).slice(-2)}`,
      creditCardIssuer: faker.finance.creditCardIssuer(),
      creditCardNumber: faker.finance.creditCardNumber(),
    };
  });

  @tracked data = this.fullData;

  @action
  emailAll(selectedItems) {
    window.alert(
      `Sending email for: ${selectedItems.map((item) => item.email).join(', ')}`
    );
  }

  @action
  showSecretData(item) {
    window.alert(
      `CVV number: ${item.creditCardCVV}\nExpire on: ${item.creditCardExpirationDate}`
    );
  }

  @action
  toggleData() {
    if (!this.data || this.data.length === 0) {
      this.data = this.fullData;
    } else {
      this.data = [];
    }
  }
}
