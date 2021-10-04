import { getRepository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import Category from '../../models/Category';

interface ExecuteProps {
  created_at: Date;
  title: string;
}

class CreateCategoryService {
  public execute({ created_at, title }: ExecuteProps): Promise<Category> {
    const categoryRepository = getRepository(Category);
    const category = categoryRepository.create({
      id: uuid(),
      created_at,
      title,
    });
    return categoryRepository.save(category).then(res => res);
  }
}

export default CreateCategoryService;
