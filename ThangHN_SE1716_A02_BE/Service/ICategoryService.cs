using BO.Models;

namespace Service
{
    public interface ICategoryService
    {
        void AddCategory(Category category);
        bool CanDeleteCategory(int id);
        void DeleteCategory(int id);
        List<Category> GetAllCategories();
        Category GetCategoryById(int id);
        List<Category> SearchCategories(string? name);
        void UpdateCategory(Category category);
    }
}