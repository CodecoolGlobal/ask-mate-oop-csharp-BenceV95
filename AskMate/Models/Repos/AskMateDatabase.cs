using Npgsql;
using System.Data.Common;
using System.Data;
using System.Collections.Generic;
using System.Reflection.Metadata.Ecma335;
using System.Security.Cryptography;
using System.Text;


namespace AskMate.Models.Repos
{
    public class AskMateDatabase : IAskMateDatabase
    {
        const int keySize = 64;
        const int iterations = 350000;
        HashAlgorithmName hashAlgorithm = HashAlgorithmName.SHA512;


        NpgsqlConnection _connectionString;
        public AskMateDatabase(NpgsqlConnection connectionString)
        {
            _connectionString = connectionString;
        }

        // questions
        public void DeleteQuestion(string questionID)
        {
            _connectionString.Open();

            using var adapter = new NpgsqlDataAdapter("DELETE FROM ONLY questions WHERE questions.id = :questionID ", _connectionString);
            adapter.SelectCommand?.Parameters.AddWithValue(":questionID", questionID);

            adapter.SelectCommand?.ExecuteNonQuery();
        }

        public string CreateNewQuestion(Question question, string loggedInUserID)
        {
            _connectionString.Open();

            using var adapter = new NpgsqlDataAdapter("INSERT INTO questions (id, user_id, body, post_date, title) VALUES (:id, :user_id, :body, :post_date, :title) RETURNING id", _connectionString);
            adapter.SelectCommand?.Parameters.AddWithValue(":post_date", DateTime.UtcNow);
            adapter.SelectCommand?.Parameters.AddWithValue(":id", GenerateID());
            adapter.SelectCommand?.Parameters.AddWithValue(":user_id", loggedInUserID);
            adapter.SelectCommand?.Parameters.AddWithValue(":body", question.Body);
            adapter.SelectCommand?.Parameters.AddWithValue(":title", question.Title);

            var createdId = (string)adapter.SelectCommand?.ExecuteScalar();

            return createdId;

        }

        public List<Question> GetAllQuestions()
        {
            _connectionString.Open();
            using var adapter = new NpgsqlDataAdapter("SELECT * FROM questions ORDER BY post_date DESC", _connectionString);

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
                    Title = row["title"] == DBNull.Value ? null : (string?)row["title"], // this is temporary, in my db some titles are null
                    Body = (string)row["body"],
                    PostDate = (DateTime)row["post_date"]
                }
                    );
            }
            _connectionString.Close();

            return queryResult;
        }

        public async Task<Question> GetQuestion(string questionID) //not sure how the related answers should be given  back, atm the question has a property which stores the related answer ids
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
                question = new Question()
                {

                    ID = reader.GetString(reader.GetOrdinal("id")),
                    UserId = reader.GetString(reader.GetOrdinal("user_id")),
                    Body = reader.GetString(reader.GetOrdinal("body")),
                    PostDate = reader.GetDateTime("post_date"),
                    Title = reader.GetString("title")
                };
            }

            // Move to the next result set (the answers)
            if (await reader.NextResultAsync() && question != null)
            {
                while (await reader.ReadAsync())
                {
                    var answerID = reader.GetString(reader.GetOrdinal("id"));

                    question.RelatedAnswersIDs.Add(answerID);
                }
            }

            return question;
        }

        // answers
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
                return new Answer()
                {
                    id = (string)row["id"],
                    user_id = (string)row["user_id"],
                    question_id = (string)row["question_id"],
                    body = (string)row["body"]
                };
            }

            _connectionString.Close();

            return null;
        }

        public object? CreateNewAnswer(Answer answer, string loggedInUserID)
        {
            _connectionString.Open();

            using var adapter = new NpgsqlDataAdapter("INSERT INTO answers (id, user_id,question_id, body, post_date) VALUES (:id, :user_id, :question_id, :body, :post_date) RETURNING id", _connectionString);
            adapter.SelectCommand?.Parameters.AddWithValue(":id", GenerateID());
            adapter.SelectCommand?.Parameters.AddWithValue(":user_id", loggedInUserID);
            adapter.SelectCommand?.Parameters.AddWithValue(":question_id", answer.question_id);
            adapter.SelectCommand?.Parameters.AddWithValue(":body", answer.body);
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

            adapter.SelectCommand?.Parameters.AddWithValue(":id", answer.id);
            adapter.SelectCommand?.Parameters.AddWithValue(":user_id", answer.user_id);
            adapter.SelectCommand?.Parameters.AddWithValue(":question_id", answer.question_id);
            adapter.SelectCommand?.Parameters.AddWithValue(":body", answer.body);

            adapter.SelectCommand?.ExecuteNonQuery();

            _connectionString.Close();
        }

        // this creates a new user in the database with given username, email and password. The pw is hashed, salted
        public object? CreateUser(string username, string email, string password)
        {
            using var connection = _connectionString;
            connection.Open();


            var generatedID = GenerateID();


            var hashedPW = HashPasword(password, out byte[] salt);

            using var command = new NpgsqlCommand(
                "INSERT INTO users (id, username, email_address, reg_time, password, salt) VALUES (:id, :username, :email_address, :reg_time, :password, :salt) RETURNING id",
                connection
            );

            command.Parameters.AddWithValue(":id", generatedID);
            command.Parameters.AddWithValue(":username", username);
            command.Parameters.AddWithValue(":email_address", email);
            command.Parameters.AddWithValue(":reg_time", DateTime.UtcNow);
            command.Parameters.AddWithValue(":password", hashedPW);
            command.Parameters.AddWithValue(":salt", salt);

            var createdId = command.ExecuteScalar()?.ToString();

            return createdId;
        }



        //authenticate
        public bool AuthUser(string usernameOrEmail, string password, out string? userID) // maybe later change it to not use the out keyword, but for now it ok
        {
            _connectionString.Open();


            var adapter = new NpgsqlDataAdapter("SELECT * FROM users WHERE username = :usernameOrEmail OR email_address = :usernameOrEmail ", _connectionString);

            adapter.SelectCommand?.Parameters.AddWithValue(":usernameOrEmail", usernameOrEmail);

            var dataSet = new DataSet();
            adapter.Fill(dataSet);
            var table = dataSet.Tables[0];

            if (table.Rows.Count > 0)
            {
                DataRow row = table.Rows[0];


                var storedHash = (string)row["password"];
                var storedSalt = (byte[])row["salt"];
                userID = (string)row["id"];

                //Console.WriteLine($"HASH: {storedHash}");
                //Console.WriteLine($"SAlt: {string.Join(", ", storedSalt)}");


                return VerifyPassword(password, storedHash, storedSalt);
            }

            _connectionString.Close();

            //if no such user found
            userID = null;
            return false;
        }

        private bool VerifyPassword(string password, string hash, byte[] salt)
        {
            var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(Encoding.UTF8.GetBytes(password), salt, iterations, hashAlgorithm, keySize);

            return CryptographicOperations.FixedTimeEquals(hashToCompare, Convert.FromHexString(hash));
        }


        private string HashPasword(string password, out byte[] salt)
        {
            salt = RandomNumberGenerator.GetBytes(keySize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(Encoding.UTF8.GetBytes(password), salt, iterations, hashAlgorithm, keySize);
            return Convert.ToHexString(hash);
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

        }

        /// <summary>
        /// Generates random IDs.
        /// </summary>
        /// <returns></returns>
        private string GenerateID()
        {
            return Guid.NewGuid().ToString();
        }

        //Create an endpoint where you can query the total points of a user, based on their contribution to the community.
        //Asking a question awards 5 points. Each answer to that question awards 1 point to the question's asker (because it was an engaging question).
        //Each answer the user creates is worth 10 points. However, any answer the user posts on their own question is worth 0 points (instead of effectively 11).
        public int CalculateUserPoints(string userID)
        {


            _connectionString.Open();
            var adapter = new NpgsqlDataAdapter(@"SELECT 
                users.id, users.username, users.email_address,
                (SELECT COUNT(*) * 5
                FROM questions
                WHERE user_id = users.id) +
                (SELECT COUNT(*) * 10
                FROM answers
                INNER JOIN questions ON answers.question_id = questions.id
                WHERE answers.user_id = users.id AND questions.user_id != users.id) +
                (SELECT COUNT(*) * 1 
                FROM answers
                INNER JOIN questions ON answers.question_id = questions.id
                WHERE questions.user_id = users.id AND answers.user_id != users.id) AS total_points
                FROM users", _connectionString);

            var dataSet = new DataSet();
            adapter.Fill(dataSet);
            var table = dataSet.Tables[0];

            if (table.Rows.Count > 0)
            {
                DataRow row = table.Rows[0];


                var totalPoints = Convert.ToInt32(row["total_points"]);

                _connectionString.Close();

                return totalPoints;
            }

            _connectionString.Close();
            return 0;
        }

        public bool ValidUser(string userID)
        {
            _connectionString.Open();
            var adapter = new NpgsqlDataAdapter("SELECT * from users WHERE id = :userID;", _connectionString);
            adapter.SelectCommand?.Parameters.AddWithValue(":userID", userID);
            if (adapter.SelectCommand.ExecuteScalar() != null)
            {
                _connectionString.Close();

                return true;
            }
            _connectionString.Close();
            return false;
        }
    }
}
