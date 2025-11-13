using BO.Models;

namespace Repository
{
    public interface ITagRepository
    {
        void AddTag(Tag tag);
        void DeleteTag(int id);
        List<Tag> GetAllTags();
        Tag GetTagById(int id);
        List<Tag> SearchTags(string? name);
        void UpdateTag(Tag tag);
    }
}