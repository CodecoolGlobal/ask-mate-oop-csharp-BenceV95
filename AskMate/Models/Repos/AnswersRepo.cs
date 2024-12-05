using Npgsql;
using System.Data;

namespace AskMate.Models.Repos
{
    public class AnswersRepo : IAnswersRepo
    {
        NpgsqlConnection _connectionString;
        public AnswersRepo(NpgsqlConnection connectionString)
        {
            _connectionString = connectionString;
        }

        public object? GetAnswer(string id)
        {
            _connectionString.Open();
            var adapter = new NpgsqlDataAdapter("SELECT * FROM answers WHERE id = :id", _connectionString);
            adapter.SelectCommand?.Parameters.AddWithValue(":id", id);

            var dataSet = new DataSet();
            adapter.Fill(dataSet);
            var table = dataSet.Tables[0];

            if (table.Rows.Count > 0)
            {
                DataRow row = table.Rows[0];
                _connectionString.Close();
                return new Answer()
                {
                    ID = (string)row["id"],
                    UserId = (string)row["user_id"],
                    QuestionID = (string)row["question_id"],
                    Body = (string)row["body"],
                    PostDate = (DateTime)row["post_date"]
                };
            }

            _connectionString.Close();

            return null;
        }

        public object? CreateNewAnswer(Answer answer, string loggedInUserID)
        {
            _connectionString.Open();

            using var adapter = new NpgsqlDataAdapter("INSERT INTO answers (id, user_id,question_id, body, post_date) VALUES (:id, :user_id, :question_id, :body, :post_date) RETURNING id", _connectionString);
            adapter.SelectCommand?.Parameters.AddWithValue(":id", Guid.NewGuid().ToString());
            adapter.SelectCommand?.Parameters.AddWithValue(":user_id", loggedInUserID);
            adapter.SelectCommand?.Parameters.AddWithValue(":question_id", answer.QuestionID);
            adapter.SelectCommand?.Parameters.AddWithValue(":body", answer.Body);
            adapter.SelectCommand?.Parameters.AddWithValue(":post_date", DateTime.UtcNow);

            var createdId = (string)adapter.SelectCommand?.ExecuteScalar();
            _connectionString.Close();
            return createdId;
        }

        public void DeleteAnswer(string id)
        {
            _connectionString.Open();

            using var adapter = new NpgsqlDataAdapter("DELETE FROM ONLY answers WHERE id = :id ", _connectionString);
            adapter.SelectCommand?.Parameters.AddWithValue(":id", id);

            adapter.SelectCommand?.ExecuteNonQuery();
            _connectionString.Close();
        }

        public void UpdateAnswer(Answer answer)
        {
            _connectionString.Open();

            var adapter = new NpgsqlDataAdapter(
                "UPDATE answers SET body = :body WHERE id = :id",
                _connectionString
            );

            adapter.SelectCommand?.Parameters.AddWithValue(":id", answer.ID);
            adapter.SelectCommand?.Parameters.AddWithValue(":user_id", answer.UserId);
            adapter.SelectCommand?.Parameters.AddWithValue(":question_id", answer.QuestionID);
            adapter.SelectCommand?.Parameters.AddWithValue(":body", answer.Body);

            adapter.SelectCommand?.ExecuteNonQuery();

            _connectionString.Close();
        }


        /// <summary>
        /// Sets the given answer's 'is_accepted' field to true
        /// </summary>
        /// <param name="answerId"></param>
        public void AcceptAnswer(string answerId)
        {
            _connectionString.Open();

            var adapter = new NpgsqlDataAdapter("UPDATE answers SET is_accepted = true WHERE id = :answerID;", _connectionString);
            adapter.SelectCommand?.Parameters.AddWithValue(":answerID", answerId);

            adapter.SelectCommand.ExecuteNonQuery();

            _connectionString.Close();
        }


        /// <summary>
        /// Returns true, if the given answer was posted for the currently logged in user's question.
        /// </summary>
        /// <param name="loggedInUserID"></param>
        /// <param name="answerId"></param>
        /// <returns></returns>
        public bool IsAnswerBelongToLoggedInUsersQuestion(string loggedInUserID, string answerId)
        {
            _connectionString.Open();

            var adapter = new NpgsqlDataAdapter(" SELECT answers.user_id AS answerer, questions.user_id AS asker, answers.is_accepted FROM answers JOIN questions ON questions.id = answers.question_id WHERE answers.id = :answerID ", _connectionString);

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
                    _connectionString.Close();
                    return true;
                }

            }
            _connectionString.Close();
            return false;

        }
    }
}
