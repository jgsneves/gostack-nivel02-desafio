// import AppError from '../errors/AppError';

import { v4 as uuid } from 'uuid';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface CreateTransactionServiceProps {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
  }: CreateTransactionServiceProps): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const transaction = transactionRepository.create({
      id: uuid(),
      title,
      value,
      type,
      category_id: '',
      created_at: new Date(),
    });
    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
