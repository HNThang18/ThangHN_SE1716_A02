using BO.DAO;
using BO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO
{
    public class TagDAO
    {
        private FUNewsManagementSystemDBContext _context;
        private static TagDAO _instance;
        public TagDAO(FUNewsManagementSystemDBContext context)
        {
            _context = context;
        }
        public static TagDAO Instance
        {
            get
            {
                if (_instance == null)
                {
                    var context = new FUNewsManagementSystemDBContext();
                    _instance = new TagDAO(context);
                }
                return _instance;
            }
        }
        public List<Tag> GetAllTags() => _context.Tags.ToList();
        public Tag GetTagById(int id) => _context.Tags.Find(id);
        public void AddTag(Tag tag)
        {
            _context.Tags.Add(tag);
            _context.SaveChanges();
        }

        public void UpdateTag(Tag tag)
        {
            var existingTag = _context.Tags.Find(tag.TagId);
            if (existingTag != null)
            {
                existingTag.TagName = tag.TagName;
                existingTag.Note = tag.Note;
                _context.Tags.Update(existingTag);
                _context.SaveChanges();
            }
        }

        public void DeleteTag(int id)
        {
            var tag = _context.Tags.Find(id);
            if (tag != null)
            {
                _context.Tags.Remove(tag);
                _context.SaveChanges();
            }
        }
        public List<Tag> SearchTags(string? name) => _context.Tags.Where(t => t.TagName == name).ToList();
    }
}
