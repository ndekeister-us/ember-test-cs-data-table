import Component from '@glimmer/component';
import { faker } from '@faker-js/faker';
import { action } from '@ember/object';

export default class ExampleFinanceComponent extends Component {
  data = [...Array(10).keys()].map(() => {
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

  @action
  showSecretData(item) {
    window.alert(
      `CVV number: ${item.creditCardCVV}\nExpire on: ${item.creditCardExpirationDate}`
    );
  }
}
