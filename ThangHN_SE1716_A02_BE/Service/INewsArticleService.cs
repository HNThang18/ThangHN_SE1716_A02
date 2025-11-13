using BO.Models;

namespace Service
{
    public interface INewsArticleService
    {
        void AddNewsArticle(NewsArticle newsArticle, int createdById);
        void DeleteNewsArticle(int id);
        List<NewsArticle> GetActiveNewsArticles();
        List<NewsArticle> GetAllNewsArticles();
        NewsArticle GetNewsArticleById(int id);
        List<NewsArticle> GetNewsArticlesByCreatedBy(int createdById);
        List<NewsArticle> GetNewsArticlesByDateRange(DateTime startDate, DateTime endDate);
        List<NewsArticle> SearchNewsArticles(string? title, int? categoryId, string? tagName);
        void UpdateNewsArticle(NewsArticle newsArticle, int updatedById);
    }
}