using BO.Models;
using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class TagService : ITagService
    {
        private readonly ITagRepository _repository;
        public TagService(ITagRepository repository)
        {
            _repository = repository;
        }
        public List<Tag> GetAllTags() => _repository.GetAllTags();

        public Tag GetTagById(int id) => _repository.GetTagById(id);

        public void AddTag(Tag tag) => _repository.AddTag(tag);
        public void UpdateTag(Tag tag) => _repository.UpdateTag(tag);
        public void DeleteTag(int id) => _repository.DeleteTag(id);
        public List<Tag> SearchTags(string? name) => _repository.SearchTags(name);
    }
}
