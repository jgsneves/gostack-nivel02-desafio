import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    return this.find()
      .then(res => {
        const income = res.reduce(
          (acc, currentValue) =>
            currentValue.type === 'income' ? acc + currentValue.value : acc,
          0,
        );
        const outcome = res.reduce(
          (acc, currentValue) =>
            currentValue.type === 'outcome' ? acc + currentValue.value : acc,
          0,
        );
        return {
          income,
          outcome,
          total: income - outcome,
        };
      })
      .catch(() => ({
        income: 0,
        outcome: 0,
        total: 0,
      }));
  }
}

export default TransactionsRepository;
