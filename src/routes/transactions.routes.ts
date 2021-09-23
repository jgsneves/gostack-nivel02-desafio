import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

import AppError from '../errors/AppError';

const transactionsRouter = Router();

transactionsRouter.get('/', async (_, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository
    .find()
    .then(res => res)
    .catch(err => new AppError(err, response.statusCode));

  const balance = await transactionsRepository
    .getBalance()
    .then(res => res)
    .catch(err => new AppError(err, response.statusCode));

  response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category_title } = request.body;
  const service = new CreateTransactionService();
  await service
    .execute({ title, value, type, category_title })
    .then(res => response.json(res))
    .catch(err => new AppError(err, response.statusCode));
});

transactionsRouter.delete('/:id', async (request, response) => {
  const id = request.url.replace('/', '');
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  transactionsRepository
    .delete(id)
    .then(res => response.json(res))
    .catch(err => new AppError(err, response.statusCode));
});

// transactionsRouter.post('/import', async (request, response) => {
//   // TODO
// });

export default transactionsRouter;
