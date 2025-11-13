using BO.Models;
using DAO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class NewsArticleRepository : INewsArticleRepository
    {
        public List<NewsArticle> GetAllNewsArticles() => NewsArticleDAO.Instance.GetAllNewsArticles();
        public NewsArticle GetNewsArticleById(int id) => NewsArticleDAO.Instance.GetNewsArticleById(id);
        public List<NewsArticle> GetActiveNewsArticles() => NewsArticleDAO.Instance.GetActiveNewsArticles();
        public List<NewsArticle> GetNewsArticlesByCreatedBy(int createdById) => NewsArticleDAO.Instance.GetNewsArticlesByCreatedBy(createdById);
        public List<NewsArticle> GetNewsArticlesByDateRange(DateTime startDate, DateTime endDate) => NewsArticleDAO.Instance.GetNewsArticlesByDateRange(startDate, endDate);
        public void AddNewsArticle(NewsArticle newsArticle) => NewsArticleDAO.Instance.AddNewsArticle(newsArticle);
        public void UpdateNewsArticle(NewsArticle newsArticle) => NewsArticleDAO.Instance.UpdateNewsArticle(newsArticle);
        public void DeleteNewsArticle(int id) => NewsArticleDAO.Instance.DeleteNewsArticle(id);
        public List<NewsArticle> SearchNewsArticles(string? title, int? categoryId, string? tagName) => NewsArticleDAO.Instance.SearchNewsArticles(title, categoryId, tagName);
    }
}
