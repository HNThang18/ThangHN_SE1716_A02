using BO.Models;
using DAO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class CategoryRepository : ICategoryRepository
    {
        public List<Category> GetAllCategories() => CategoryDAO.Instance.GetAllCategories();
        public Category GetCategoryById(int id) => CategoryDAO.Instance.GetCategoryById(id);
        public void AddCategory(Category category) => CategoryDAO.Instance.AddCategory(category);
        public void UpdateCategory(Category category) => CategoryDAO.Instance.UpdateCategory(category);
        public void DeleteCategory(int id) => CategoryDAO.Instance.DeleteCategory(id);
        public bool CanDeleteCategory(int id) => CategoryDAO.Instance.CanDeleteCategory(id);
        public List<Category> SearchCategories(string? name) => CategoryDAO.Instance.SearchCategories(name);
    }
}
