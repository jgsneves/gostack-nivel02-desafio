import { v4 as uuid } from 'uuid';
import { getCustomRepository } from 'typeorm';
import AppError from '../../errors/AppError';
import TransactionsRepository from '../../repositories/TransactionsRepository';
import Transaction from '../../models/Transaction';
import FindOneCategoryService from '../categories/FindOneCategoryService';
import CreateCategoryService from '../categories/CreateCategoryService';

interface CreateTransactionServiceProps {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: CreateTransactionServiceProps): Promise<Transaction | AppError> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    if (title && value && type && category) {
      const categoryService = new FindOneCategoryService();
      const existingCategory = await categoryService
        .execute(category)
        .then(res => res);

      const totalBalance = (await transactionRepository.getBalance()).total;

      if (totalBalance < value && type === 'outcome') {
        return new AppError('Insuficient balance to process this transaction!');
      }

      if (!existingCategory) {
        const createCategoryService = new CreateCategoryService();
        createCategoryService.execute({
          created_at: new Date(),
          title: category,
        });
      }

      const transaction = transactionRepository.create({
        id: uuid(),
        title,
        value,
        type,
        category,
        created_at: new Date(),
      });
      await transactionRepository.save(transaction);

      return transaction;
    }
    return new AppError(
      'To create a new transaction, you must inform its title, value, type and category',
    );
  }
}

export default CreateTransactionService;
