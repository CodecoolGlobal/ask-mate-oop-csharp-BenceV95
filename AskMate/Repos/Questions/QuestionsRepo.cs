using AskMate.Models.Questions;
using AskMate.Repos.Questions;
using Npgsql;
using System.Data;

namespace AskMate.Repos
{
    public class QuestionsRepo : IQuestionsRepo
    {

        private string _connectionString;


        public QuestionsRepo(string connectionString)
        {
            _connectionString = connectionString;
        }

        //delete
        public void DeleteQuestion(string questionID)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            using var adapter = new NpgsqlDataAdapter("DELETE FROM ONLY questions WHERE questions.id = :questionID ", connection);
            adapter.SelectCommand?.Parameters.AddWithValue(":questionID", questionID);

            adapter.SelectCommand?.ExecuteNonQuery();

        }

        public List<Question>? Search(string query)
        {
            
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            using var adapter =
                new NpgsqlDataAdapter(@"
                    SELECT *
                    FROM questions
                    WHERE to_tsvector('english', title || ' ' || body)
                        @@ to_tsquery('english', @query)
                    LIMIT 10",
                    connection);
            adapter.SelectCommand?.Parameters.AddWithValue("query", $"{query}:*");

            var dataSet = new DataSet();
            adapter.Fill(dataSet);
            var table = dataSet.Tables[0];

            var queryResult = new List<Question>();
            foreach (DataRow row in table.Rows)
            {
                queryResult.Add(new Question()
                    {
                        ID = (string)row["id"],
                        UserId = (string)row["user_id"],
                        Title = (string)row["title"],
                        Body = (string)row["body"],
                        PostDate = (DateTime)row["post_date"],
                        Categories = (int)row["categories"],
                        RelatedAnswerCount = GetNumberOfRelatedAnswersByQuestionId((string)row["id"])
                    }
                );
            }

            return queryResult;
        }

        //create
        public string CreateNewQuestion(Question question, string loggedInUserID)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            using var adapter = new NpgsqlDataAdapter("INSERT INTO questions (id, user_id, body, post_date, title, categories) VALUES (:id, :user_id, :body, :post_date, :title, :categories) RETURNING id", connection);
            adapter.SelectCommand?.Parameters.AddWithValue(":post_date", DateTime.UtcNow);
            adapter.SelectCommand?.Parameters.AddWithValue(":id", Guid.NewGuid().ToString());
            adapter.SelectCommand?.Parameters.AddWithValue(":user_id", loggedInUserID);
            //adapter.SelectCommand?.Parameters.AddWithValue(":user_id", question.UserId);
            adapter.SelectCommand?.Parameters.AddWithValue(":body", question.Body);
            adapter.SelectCommand?.Parameters.AddWithValue(":title", question.Title);
            adapter.SelectCommand?.Parameters.AddWithValue(":categories", question.Categories);

            var createdId = (string)adapter.SelectCommand?.ExecuteScalar();

            return createdId;

        }


        private int GetNumberOfRelatedAnswersByQuestionId(string id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            var query = "SELECT COUNT(question_id) FROM answers WHERE question_id = :id";

            using var command = new NpgsqlCommand(query, connection);
            command.Parameters.AddWithValue(":id", id);

            var result = command.ExecuteScalar();

            return Convert.ToInt32(result);
        }

        //getAll
        public List<Question> GetAllQuestions()
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();
            using var adapter = new NpgsqlDataAdapter("SELECT * FROM questions ORDER BY post_date DESC", connection);

            var dataSet = new DataSet();
            adapter.Fill(dataSet);
            var table = dataSet.Tables[0];

            var queryResult = new List<Question>();
            foreach (DataRow row in table.Rows)
            {
                queryResult.Add(new Question()
                {
                    ID = (string)row["id"],
                    UserId = (string)row["user_id"],
                    Title = (string)row["title"],
                    Body = (string)row["body"],
                    PostDate = (DateTime)row["post_date"],
                    Categories = (int)row["categories"],
                    RelatedAnswerCount = GetNumberOfRelatedAnswersByQuestionId((string)row["id"])
                }
                );
            }
            return queryResult;
        }

        //getOne
        public async Task<Question> GetQuestion(string questionID)
        {
            using var connection = new NpgsqlConnection(_connectionString);

            await connection.OpenAsync();

            await using var batch = new NpgsqlBatch(connection)
            {
                BatchCommands =
                {
                        new($"SELECT * FROM questions WHERE id = @questionID")
                        {
                              Parameters = { new("questionID", questionID) }
                        },
                        new($"SELECT * FROM answers WHERE question_id = @questionID")
                        {
                            Parameters = { new("questionID", questionID) }
                          }
                 }
            };

            Question question = null;

            await using var reader = await batch.ExecuteReaderAsync();

            // Read the first query result (the question)
            if (await reader.ReadAsync())
            {
                question = new Question()
                {

                    ID = reader.GetString(reader.GetOrdinal("id")),
                    UserId = reader.GetString(reader.GetOrdinal("user_id")),
                    Body = reader.GetString(reader.GetOrdinal("body")),
                    PostDate = reader.GetDateTime("post_date"),
                    Title = reader.GetString("title"),
                    Categories = reader.GetInt32("categories")
                };
            }
            return question;
        }

        // gets questions based on category with an optional limit which is by default 10
        public List<Question> GetQuestions(int? categoryId, int limit)
        {
            Console.WriteLine($"categoryId: {categoryId} , limit: {limit}");
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();
            string command = $"SELECT * FROM questions ORDER BY post_date DESC LIMIT {limit}";
            if (categoryId != null)
            {
                command = $"SELECT * FROM questions WHERE categories = {categoryId} ORDER BY post_date DESC LIMIT {limit}";
            }
            using var adapter = new NpgsqlDataAdapter(command, connection);

            var dataSet = new DataSet();
            adapter.Fill(dataSet);
            var table = dataSet.Tables[0];

            var queryResult = new List<Question>();
            foreach (DataRow row in table.Rows)
            {
                queryResult.Add(new Question()
                    {
                        ID = (string)row["id"],
                        UserId = (string)row["user_id"],
                        Title = (string)row["title"],
                        Body = (string)row["body"],
                        PostDate = (DateTime)row["post_date"],
                        Categories = (int)row["categories"],
                        RelatedAnswerCount = GetNumberOfRelatedAnswersByQuestionId((string)row["id"])
                    }
                );
            }
            return queryResult;
        }
    }
}
