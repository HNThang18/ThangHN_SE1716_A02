using BO.DAO;
using BO.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO
{
    public class NewsArticleDAO
    {
        private FUNewsManagementSystemDBContext _context;
        private static NewsArticleDAO _instance;
        public NewsArticleDAO(FUNewsManagementSystemDBContext context)
        {
            _context = context;
        }
        public static NewsArticleDAO Instance
        {
            get 
            { 
                if (_instance == null)
                {
                    var context = new FUNewsManagementSystemDBContext();
                    _instance = new NewsArticleDAO(context);
                }
                return _instance; 
            }
        }
        public List<NewsArticle> GetAllNewsArticles() => _context.NewsArticles.Include("Category").Include("CreatedBy").Include("UpdatedBy").Include("Tags").ToList();
        public NewsArticle GetNewsArticleById(int id) => _context.NewsArticles.Include("Category").Include("CreatedBy").Include("UpdatedBy").Include("Tags").FirstOrDefault(na => na.NewsArticleId == id);
        public List<NewsArticle> GetActiveNewsArticles() => _context.NewsArticles.Where(na => na.NewsStatus).Include("Category").Include("CreatedBy").Include("UpdatedBy").Include("Tags").ToList();
        public List<NewsArticle> GetNewsArticlesByCreatedBy(int createdById) => _context.NewsArticles.Where(na => na.CreatedById == createdById).Include("Category").Include("CreatedBy").Include("UpdatedBy").Include("Tags").ToList();
        public List<NewsArticle> GetNewsArticlesByDateRange(DateTime startDate, DateTime endDate) => _context.NewsArticles.Where(na => na.CreatedDate >= startDate && na.CreatedDate <= endDate).Include("Category").Include("CreatedBy").Include("UpdatedBy").Include("Tags").ToList();
        public void AddNewsArticle(NewsArticle newsArticle)
        {
            if (newsArticle.Tags != null)
            {
                newsArticle.Tags.Clear();
            }
            
            _context.NewsArticles.Add(newsArticle);
            _context.SaveChanges(); 
        }

        public void UpdateNewsArticle(NewsArticle newsArticle)
        {
            var existingArticle = _context.NewsArticles.Include(na => na.Tags).FirstOrDefault(na => na.NewsArticleId == newsArticle.NewsArticleId);
            if (existingArticle == null) return;

            // Update basic properties
            existingArticle.NewsTitle = newsArticle.NewsTitle;
            existingArticle.Headline = newsArticle.Headline;
            existingArticle.NewsContent = newsArticle.NewsContent;
            existingArticle.NewsSource = newsArticle.NewsSource;
            existingArticle.CategoryId = newsArticle.CategoryId;
            existingArticle.NewsStatus = newsArticle.NewsStatus;
            existingArticle.UpdatedById = newsArticle.UpdatedById;
            existingArticle.ModifiedDate = newsArticle.ModifiedDate;

            // Update tags - clear existing and add new ones
            existingArticle.Tags.Clear();
            if (newsArticle.Tags != null && newsArticle.Tags.Any())
            {
                var tagIds = newsArticle.Tags.Select(t => t.TagId).ToList();
                var newTags = _context.Tags.Where(t => tagIds.Contains(t.TagId)).ToList();
                foreach (var tag in newTags)
                {
                    existingArticle.Tags.Add(tag);
                }
            }
            
            // No need to call Update() since we're modifying the tracked entity
            _context.SaveChanges();
        }

        public void DeleteNewsArticle(int id)
        {
            var newsArticle = _context.NewsArticles.Find(id);
            if (newsArticle != null)
            {
                _context.NewsArticles.Remove(newsArticle);
                _context.SaveChanges();
            }
        }

        public List<NewsArticle> SearchNewsArticles(string? title, int? categoryId, string? tagName)
        {
            var query = _context.NewsArticles.Include("Category").Include("CreatedBy").Include("UpdatedBy").Include("Tags").AsQueryable();

            if (!string.IsNullOrEmpty(title))
            {
                query = query.Where(na => na.NewsTitle.Contains(title));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(na => na.CategoryId == categoryId.Value);
            }

            if (!string.IsNullOrEmpty(tagName))
            {
                query = query.Where(na => na.Tags.Any(t => t.TagName.Contains(tagName)));
            }

            return query.ToList();
        }
    }
}
