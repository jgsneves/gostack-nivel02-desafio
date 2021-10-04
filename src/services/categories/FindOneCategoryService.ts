import { getRepository } from 'typeorm';
import Category from '../../models/Category';

class FindOneCategoryService {
  public async execute(name: string): Promise<Category | undefined> {
    const categoryRepository = getRepository(Category);
    const singleCategory = await categoryRepository.findOne({
      where: { title: name },
    });
    return singleCategory;
  }
}

export default FindOneCategoryService;
