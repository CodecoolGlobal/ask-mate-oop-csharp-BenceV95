namespace AskMate.Models.Repos
{
    public interface ICategoriesRepo
    {
        public bool CreateCategory(string name);
        public bool GetAllCategories();
        public bool UpdateCategory(int id, string name);
        public bool DeleteCategory(int id);

    }
}
