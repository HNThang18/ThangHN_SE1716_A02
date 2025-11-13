using BO.Models;
using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;
        public CategoryService (ICategoryRepository repository)
        {
            _repository = repository;
        }
        public List<Category> GetAllCategories() => _repository.GetAllCategories();

        public Category GetCategoryById(int id) => _repository.GetCategoryById(id);

        public void AddCategory(Category category) => _repository.AddCategory(category);
        public void UpdateCategory(Category category) => _repository.UpdateCategory(category);
        public void DeleteCategory(int id)
        {
            if (!CanDeleteCategory(id))
            {
                throw new InvalidOperationException("Cannot delete category that is being used by news articles.");
            }
            _repository.DeleteCategory(id);
        }
        public bool CanDeleteCategory(int id) => _repository.CanDeleteCategory(id);
        public List<Category> SearchCategories(string? name) => _repository.SearchCategories(name);
    }
}
