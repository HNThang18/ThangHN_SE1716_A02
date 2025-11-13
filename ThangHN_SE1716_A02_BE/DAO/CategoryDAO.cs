using BO.DAO;
using BO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO
{
    public class CategoryDAO
    {
        private FUNewsManagementSystemDBContext _context;
        private static CategoryDAO _instance;
        public CategoryDAO(FUNewsManagementSystemDBContext context)
        {
            _context = context;
        }
        public static CategoryDAO Instance
        {
            get
            {
                if (_instance == null)
                {
                    var context = new FUNewsManagementSystemDBContext();
                    _instance = new CategoryDAO(context);
                }
                return _instance;
            }
        }
        public List<Category> GetAllCategories() => _context.Categories.ToList();
        public Category GetCategoryById(int id) => _context.Categories.Find(id);
        public void AddCategory(Category category) 
        { 
            _context.Categories.Add(category);
            _context.SaveChanges();
        }
        public void UpdateCategory(Category category)
        {
            var existingCategory = _context.Categories.Find(category.CategoryId);
            if (existingCategory != null)
            {
                existingCategory.CategoryName = category.CategoryName;
                existingCategory.CategoryDescription = category.CategoryDescription;
                _context.Categories.Update(existingCategory);
                _context.SaveChanges();
            }
        }
        public void DeleteCategory(int id)
        {
            var category = _context.Categories.Find(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                _context.SaveChanges();
            }
        }
        public bool CanDeleteCategory(int id) => !_context.NewsArticles.Any(na => na.CategoryId == id);
        public List<Category> SearchCategories(string name) => _context.Categories.Where(c => c.CategoryName == name).ToList();
    }
}
