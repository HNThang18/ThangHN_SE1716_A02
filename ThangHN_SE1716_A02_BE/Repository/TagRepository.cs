using BO.Models;
using DAO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class TagRepository : ITagRepository
    {
        public List<Tag> GetAllTags() => TagDAO.Instance.GetAllTags();
        public Tag GetTagById(int id) => TagDAO.Instance.GetTagById(id);
        public void AddTag(Tag tag) => TagDAO.Instance.AddTag(tag);
        public void UpdateTag(Tag tag) => TagDAO.Instance.UpdateTag(tag);
        public void DeleteTag(int id) => TagDAO.Instance.DeleteTag(id);
        public List<Tag> SearchTags(string? name) => TagDAO.Instance.SearchTags(name);
    }
}
