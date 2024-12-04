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
        const int keySize = 16; //it was 64 by default, but to make the output only 32 digits long it now reduced to 16
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

        public string CreateNewQuestion(Question question)
        {
            _connectionString.Open();

            using var adapter = new NpgsqlDataAdapter("INSERT INTO questions (id, user_id, body, post_date) VALUES (:id, :user_id, :body, :post_date) RETURNING id", _connectionString);
            adapter.SelectCommand?.Parameters.AddWithValue(":post_date", question.PostDate);
            adapter.SelectCommand?.Parameters.AddWithValue(":id", question.ID);
            adapter.SelectCommand?.Parameters.AddWithValue(":user_id", question.UserID);
            adapter.SelectCommand?.Parameters.AddWithValue(":body", question.Body);

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
                    (string)row["body"],
                    (DateTime)row["post_date"]
                    ));
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
                question = new Question(
                    reader.GetString(reader.GetOrdinal("id")),
                    reader.GetString(reader.GetOrdinal("user_id")),
                    reader.GetString(reader.GetOrdinal("body")),
                    reader.GetDateTime("post_date")
                );
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

        public object? CreateNewAnswer(Answer answer)
        {
            _connectionString.Open();

            using var adapter = new NpgsqlDataAdapter("INSERT INTO answers (id, user_id,question_id, body) VALUES (:id, :user_id, :question_id, :body) RETURNING id", _connectionString);
            adapter.SelectCommand?.Parameters.AddWithValue(":id", answer.id);
            adapter.SelectCommand?.Parameters.AddWithValue(":user_id", answer.user_id);
            adapter.SelectCommand?.Parameters.AddWithValue(":question_id", answer.question_id);
            adapter.SelectCommand?.Parameters.AddWithValue(":body", answer.body);

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


            var generatedID = Guid.NewGuid().ToString();


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

        public bool IsAnswerBelongToLoggedInUsersQuestion(string loggedInUserID, string answerId)
        {

            //megkeresni a választ id alapján

            // ha a válaszhoz tartozó question_id megszerezése

            // kérdésekből a question_id alpján megnézni, hogy a kérdésnél a user_id == a jelenleg belépett userID-val


            //user id the current logged in user

            //answer id is the answer which we want to accept
            Console.WriteLine("userID" + loggedInUserID);
            Console.WriteLine("answerID" + answerId);
            _connectionString.Open();

            var adapter = new NpgsqlDataAdapter(" SELECT answers.user_id AS answerer, questions.user_id AS asker, answers.is_accepted FROM answers JOIN questions ON questions.id = answers.question_id WHERE answers.id = :answerID ", _connectionString);


            adapter.SelectCommand?.Parameters.AddWithValue(":answerID", answerId);

            var dataSet = new DataSet();
            adapter.Fill(dataSet);
            var table = dataSet.Tables[0];

            Console.WriteLine(table.Rows.Count);


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



        public void AcceptAnswer(string answerId)
        {
            _connectionString.Open();

            var adapter = new NpgsqlDataAdapter("UPDATE answers SET is_accepted = true WHERE id = :answerID;", _connectionString);
            adapter.SelectCommand?.Parameters.AddWithValue(":answerID", answerId);

            adapter.SelectCommand.ExecuteNonQuery();

        }
    }
}
