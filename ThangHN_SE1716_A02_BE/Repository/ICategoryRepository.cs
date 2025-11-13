using BO.Models;

namespace Repository
{
    public interface ICategoryRepository
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