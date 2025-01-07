using Npgsql;

namespace AskMate.Models.Repos
{
    public class CategoriesRepo : ICategoriesRepo
    {
        string _connectionString;


        public CategoriesRepo(string connectionString)
        {
            _connectionString = connectionString;
        }

        public bool CreateCategory(string name)
        {
            using var connection = new NpgsqlConnection(_connectionString);

            connection.Open();
            using var command = new NpgsqlCommand(
                "INSERT INTO categories(name) VALUES (:name)", connection);

            command.Parameters.AddWithValue(":name", name);

            var createdId = command.ExecuteNonQuery();

            return createdId != -1;
        }

        public bool GetAllCategories()
        {
            throw new NotImplementedException();
        }

        public bool UpdateCategory(int id, string name)
        {
            throw new NotImplementedException();
        }

        public bool DeleteCategory(int id)
        {
            throw new NotImplementedException();
        }
    }
}
