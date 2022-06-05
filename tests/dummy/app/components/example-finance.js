import Component from '@glimmer/component';
import { faker } from '@faker-js/faker';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ExampleFinanceComponent extends Component {
  @tracked enableFiltering = true;

  @tracked searchDebounce = '500';

  get columns() {
    return [
      {
        key: 'id',
        label: 'ID',
        searchable: this.enableFiltering,
      },
      {
        key: 'name',
        label: 'Name',
        searchable: this.enableFiltering,
      },
      {
        key: 'amount',
        label: 'Amount',
      },
      {
        key: 'strangeKey',
        label: 'Email',
        searchable: this.enableFiltering,
        searchKey: 'email',
      },
      {
        key: 'creditCardIssuer',
        label: 'Credit card issuer',
        searchable: this.enableFiltering,
      },
      {
        key: 'creditCardNumber',
        label: 'Credit card number',
        searchable: this.enableFiltering,
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
