using AskMate.Models;
using Npgsql;
using System.Data;

namespace AskMate.Repos
{
    public class AnswersRepo : IAnswersRepo
    {
        string _connectionString;
        public AnswersRepo(string connectionString)
        {
            _connectionString = connectionString;
        }

        public object? GetAnswer(string id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            using var adapter = new NpgsqlDataAdapter("SELECT * FROM answers WHERE id = :id", connection);
            adapter.SelectCommand?.Parameters.AddWithValue(":id", id);

            var dataSet = new DataSet();
            adapter.Fill(dataSet);
            var table = dataSet.Tables[0];

            if (table.Rows.Count > 0)
            {
                DataRow row = table.Rows[0];
                return new Answer()
                {
                    ID = (string)row["id"],
                    UserId = (string)row["user_id"],
                    QuestionID = (string)row["question_id"],
                    Body = (string)row["body"],
                    PostDate = (DateTime)row["post_date"]
                };
            }

            return null;
        }

        public object? CreateNewAnswer(Answer answer, string loggedInUserID)
        {

            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            using var adapter = new NpgsqlDataAdapter("INSERT INTO answers (id, user_id,question_id, body, post_date) VALUES (:id, :user_id, :question_id, :body, :post_date) RETURNING id", connection);
            adapter.SelectCommand?.Parameters.AddWithValue(":id", Guid.NewGuid().ToString());
            adapter.SelectCommand?.Parameters.AddWithValue(":user_id", loggedInUserID);
            adapter.SelectCommand?.Parameters.AddWithValue(":question_id", answer.QuestionID);
            adapter.SelectCommand?.Parameters.AddWithValue(":body", answer.Body);
            adapter.SelectCommand?.Parameters.AddWithValue(":post_date", DateTime.UtcNow);

            var createdId = (string)adapter.SelectCommand?.ExecuteScalar();

            return createdId;
        }

        public List<Answer>? GetAllAnswersByQuestionId(string id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();
            List<Answer> answers = new List<Answer>();

            using (var command = new NpgsqlCommand("SELECT * FROM answers WHERE question_id = :id", connection))
            {
                command.Parameters.AddWithValue(":id", id);
                using (var reader = command.ExecuteReader())
                    while (reader.Read())
                    {
                        answers.Add(new Answer()
                        {
                            ID = reader.GetString(reader.GetOrdinal("id")),
                            UserId = reader.GetString(reader.GetOrdinal("user_id")),
                            QuestionID = reader.GetString(reader.GetOrdinal("question_id")),
                            Body = reader.GetString(reader.GetOrdinal("body")),
                            PostDate = reader.GetDateTime(reader.GetOrdinal("post_date"))
                        });
                    }
            }
            return answers.Count <= 0 ? null : answers;
        }

        public void DeleteAnswerByQuestionId(string id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            using var adapter = new NpgsqlDataAdapter("DELETE FROM ONLY answers WHERE question_id = :id ", connection);
            adapter.SelectCommand?.Parameters.AddWithValue(":id", id);

            adapter.SelectCommand?.ExecuteNonQuery();
        }


        public void DeleteAnswer(string id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            using var adapter = new NpgsqlDataAdapter("DELETE FROM ONLY answers WHERE id = :id ", connection);
            adapter.SelectCommand?.Parameters.AddWithValue(":id", id);

            adapter.SelectCommand?.ExecuteNonQuery();
        }

        public void UpdateAnswer(Answer answer)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();


            using var adapter = new NpgsqlDataAdapter(
                  "UPDATE answers SET body = :body WHERE id = :id", connection);

            adapter.SelectCommand?.Parameters.AddWithValue(":id", answer.ID);
            adapter.SelectCommand?.Parameters.AddWithValue(":user_id", answer.UserId);
            adapter.SelectCommand?.Parameters.AddWithValue(":question_id", answer.QuestionID);
            adapter.SelectCommand?.Parameters.AddWithValue(":body", answer.Body);

            adapter.SelectCommand?.ExecuteNonQuery();

        }


        /// <summary>
        /// Sets the given answer's 'is_accepted' field to true
        /// </summary>
        /// <param name="answerId"></param>
        public void AcceptAnswer(string answerId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            using var adapter = new NpgsqlDataAdapter("UPDATE answers SET is_accepted = true WHERE id = :answerID;", connection);
            adapter.SelectCommand?.Parameters.AddWithValue(":answerID", answerId);

            adapter.SelectCommand.ExecuteNonQuery();

        }


        /// <summary>
        /// Returns true, if the given answer was posted for the currently logged in user's question.
        /// </summary>
        /// <param name="loggedInUserID"></param>
        /// <param name="answerId"></param>
        /// <returns></returns>
        public bool IsAnswerBelongToLoggedInUsersQuestion(string loggedInUserID, string answerId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            using var adapter = new NpgsqlDataAdapter(" SELECT answers.user_id AS answerer, questions.user_id AS asker, answers.is_accepted FROM answers JOIN questions ON questions.id = answers.question_id WHERE answers.id = :answerID ", connection);

            adapter.SelectCommand?.Parameters.AddWithValue(":answerID", answerId);

            var dataSet = new DataSet();
            adapter.Fill(dataSet);
            var table = dataSet.Tables[0];


            if (table.Rows.Count > 0)
            {
                DataRow row = table.Rows[0];

                var storedUserId = (string)row["asker"];

                if (storedUserId == loggedInUserID)
                {
                    return true;
                }

            }
            return false;

        }
    }
}
