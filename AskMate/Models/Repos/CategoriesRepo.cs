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

        public List<Category> GetAllCategories()
        {
            List<Category> categories = new List<Category>();

            // Create and use a new connection instance
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();
                using (var command = new NpgsqlCommand("SELECT id, name FROM categories", connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            categories.Add(new Category()
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("id")),
                                Name = reader.GetString(reader.GetOrdinal("name"))

                            });
                        }
                    }
                }
            }

            return categories;
        }

        public bool UpdateCategory(int id, string name)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            using (var command = new NpgsqlCommand(
                       @"UPDATE categories
                                SET name = :name
                                WHERE categories.id = :id ",
                       connection))
            {
                command.Parameters.AddWithValue(":id", id);
                command.Parameters.AddWithValue(":name", name);
                var status = command.ExecuteNonQuery();

                return status != -1;

            };
        }

        public bool DeleteCategory(int id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            using (var command = new NpgsqlCommand(
                       "DELETE FROM ONLY categories WHERE categories.id = :id ",
                       connection))
            {
                command.Parameters.AddWithValue(":id", id);
                var status = command.ExecuteNonQuery();

                return status != -1;

            };
        }
    }
}
