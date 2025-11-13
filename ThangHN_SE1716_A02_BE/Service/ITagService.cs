using BO.Models;

namespace Service
{
    public interface ITagService
    {
        void AddTag(Tag tag);
        void DeleteTag(int id);
        List<Tag> GetAllTags();
        Tag GetTagById(int id);
        List<Tag> SearchTags(string? name);
        void UpdateTag(Tag tag);
    }
}