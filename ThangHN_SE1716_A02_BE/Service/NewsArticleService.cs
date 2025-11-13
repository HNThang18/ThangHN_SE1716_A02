using BO.Models;
using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class NewsArticleService : INewsArticleService
    {
        private readonly INewsArticleRepository _repository;
        public NewsArticleService(INewsArticleRepository repository)
        {
            _repository = repository;
        }
        public List<NewsArticle> GetAllNewsArticles() => _repository.GetAllNewsArticles();

        public NewsArticle GetNewsArticleById(int id) => _repository.GetNewsArticleById(id);

        public List<NewsArticle> GetActiveNewsArticles() => _repository.GetActiveNewsArticles();

        public List<NewsArticle> GetNewsArticlesByCreatedBy(int createdById) => _repository.GetNewsArticlesByCreatedBy(createdById);

        public List<NewsArticle> GetNewsArticlesByDateRange(DateTime startDate, DateTime endDate) => _repository.GetNewsArticlesByDateRange(startDate, endDate);

        public void AddNewsArticle(NewsArticle newsArticle, int createdById)
        {
            newsArticle.CreatedById = createdById;
            newsArticle.CreatedDate = DateTime.Now;
            newsArticle.NewsStatus = true;
            _repository.AddNewsArticle(newsArticle);
        }

        public void UpdateNewsArticle(NewsArticle newsArticle, int updatedById)
        {
            newsArticle.UpdatedById = updatedById;
            newsArticle.ModifiedDate = DateTime.Now;
            _repository.UpdateNewsArticle(newsArticle);
        }

        public void DeleteNewsArticle(int id) => _repository.DeleteNewsArticle(id);
        public List<NewsArticle> SearchNewsArticles(string? title, int? categoryId, string? tagName) => _repository.SearchNewsArticles(title, categoryId, tagName);
    }
}
