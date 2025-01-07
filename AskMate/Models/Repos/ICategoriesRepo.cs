﻿namespace AskMate.Models.Repos
{
    public interface ICategoriesRepo
    {
        public bool CreateCategory(string name);
        public List<Category> GetAllCategories();
        public bool UpdateCategory(int id, string name);
        public bool DeleteCategory(int id);

    }
}
