using BO.Models;

namespace Repository
{
    public interface INewsArticleRepository
    {
        void AddNewsArticle(NewsArticle newsArticle);
        void DeleteNewsArticle(int id);
        List<NewsArticle> GetActiveNewsArticles();
        List<NewsArticle> GetAllNewsArticles();
        NewsArticle GetNewsArticleById(int id);
        List<NewsArticle> GetNewsArticlesByCreatedBy(int createdById);
        List<NewsArticle> GetNewsArticlesByDateRange(DateTime startDate, DateTime endDate);
        List<NewsArticle> SearchNewsArticles(string? title, int? categoryId, string? tagName);
        void UpdateNewsArticle(NewsArticle newsArticle);
    }
}