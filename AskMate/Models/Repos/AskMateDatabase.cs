using AskMate.Models.QuestionModel;
using Npgsql;
using System.Data.Common;
using System.Data;
using System.Collections.Generic;


namespace AskMate.Models.Repos
{
    public class AskMateDatabase : IAskMateDatabase
    {
        NpgsqlConnection _connectionString; //maybe this could use an interface
        public AskMateDatabase(NpgsqlConnection connectionString)
        {
            _connectionString = connectionString;
        }


        public void DeleteQuestion(string questionID)
        {
            _connectionString.Open();

            using var adapter = new NpgsqlDataAdapter("DELETE FROM ONLY questions WHERE questions.id = :questionID ", _connectionString);
            adapter.SelectCommand?.Parameters.AddWithValue(":questionID", questionID);

            adapter.SelectCommand?.ExecuteNonQuery();
        }

        public string CreateNewQuestion(Question question)
        {
            _connectionString.Open();

            using var adapter = new NpgsqlDataAdapter("INSERT INTO questions (id, answer_id, body) VALUES (:id, :user_id, :body) RETURNING id", _connectionString);
            adapter.SelectCommand?.Parameters.AddWithValue(":id", question.ID);
            adapter.SelectCommand?.Parameters.AddWithValue(":answer_id", question.UserID);
            adapter.SelectCommand?.Parameters.AddWithValue(":id", question.ID);

            var createdId = (string)adapter.SelectCommand?.ExecuteScalar();

            return createdId;

        }

        public List<Question> GetAllQuestions()
        {
            _connectionString.Open();
            using var adapter = new NpgsqlDataAdapter("SELECT * FROM questions ORDER BY post_date", _connectionString);

            var dataSet = new DataSet();
            adapter.Fill(dataSet);
            var table = dataSet.Tables[0];

            var queryResult = new List<Question>();
            foreach (DataRow row in table.Rows)
            {
                queryResult.Add(new Question(
                    (string)row["id"],
                    (string)row["user_id"],
                    (string)row["body"]
                    ));
            }
            _connectionString.Close();

            return queryResult;
        }


        public async Task<Question> GetQuestion(int questionID) //not sure how the related answers should be given  back, atm the question has a property which stores the related answer ids
        {
            await _connectionString.OpenAsync();

            await using var batch = new NpgsqlBatch(_connectionString)
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
                question = new Question(
                    reader.GetString(reader.GetOrdinal("id")),
                    reader.GetString(reader.GetOrdinal("user_id")),
                    reader.GetString(reader.GetOrdinal("body"))
                );
            }

            // Move to the next result set (the answers)
            if (await reader.NextResultAsync() && question != null)
            {
                while (await reader.ReadAsync())
                {
                    var answerID = reader.GetInt32(reader.GetOrdinal("id"));

                    question.RelatedAnswersIDs.Add(answerID);
                }
            }

            return question;
        }
    }

}

