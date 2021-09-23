import { v4 as uuid } from 'uuid';
import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface CreateTransactionServiceProps {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_title: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category_title,
  }: CreateTransactionServiceProps): Promise<Transaction | AppError> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    if (title && value && type && category_title) {
      const transaction = transactionRepository.create({
        id: uuid(),
        title,
        value,
        type,
        category_title,
        created_at: new Date(),
      });
      await transactionRepository.save(transaction);

      return transaction;
    }
    return new AppError(
      'To create a new transaction, you must inform its title, value, type and category_title',
    );
  }
}

export default CreateTransactionService;
