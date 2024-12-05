using Npgsql;
using System.Data;
using System.Security.Cryptography;
using System.Text;

namespace AskMate.Models.Repos
{
    public class UserRepo : IUserRepo
    {
        NpgsqlConnection _connectionString;


        public UserRepo(NpgsqlConnection connectionString)
        {
            _connectionString = connectionString;
        }


        public int CalculateUserPoints(string userID)
        {
            try
            {
                _connectionString.Open();

                // SQL query to calculate total points
                var adapter = new NpgsqlDataAdapter(@"
            SELECT 
                users.id, 
                (SELECT COUNT(*) * 5
                 FROM questions
                 WHERE questions.user_id = users.id) +
                (SELECT COUNT(*) * 10
                 FROM answers
                 INNER JOIN questions ON answers.question_id = questions.id
                 WHERE answers.user_id = users.id AND questions.user_id != users.id) +
                (SELECT COUNT(*) * 1 
                 FROM answers
                 INNER JOIN questions ON answers.question_id = questions.id
                 WHERE questions.user_id = users.id AND answers.user_id != users.id) AS total_points
            FROM users
            WHERE users.id = :userID", _connectionString);

                // Add parameter to prevent SQL injection
                adapter.SelectCommand?.Parameters.AddWithValue(":userID", userID);

                // Execute and fill the dataset
                var dataSet = new DataSet();
                adapter.Fill(dataSet);
                var table = dataSet.Tables[0];

                // Check if a row exists
                if (table.Rows.Count > 0)
                {
                    var row = table.Rows[0]; // Assuming one row since user ID is unique
                    Console.WriteLine($"User ID: {row["id"]}, Total Points: {row["total_points"]}");

                    // Return total_points as integer
                    return Convert.ToInt32(row["total_points"]);
                }
            }
            finally
            {
                // Ensure the connection is closed
                _connectionString.Close();
            }

            // Return 0 if no rows found or user ID doesn't exist
            return 0;
        }

        public bool ValidUser(string userID)
        {
            _connectionString.Open();
            var adapter = new NpgsqlDataAdapter("SELECT * FROM users WHERE id = :userID;", _connectionString);
            adapter.SelectCommand?.Parameters.AddWithValue(":userID", userID);
            if (adapter.SelectCommand.ExecuteScalar() != null)
            {
                _connectionString.Close();
                return true;
            }
            _connectionString.Close();
            return false;
        }

        // this creates a new user in the database with given username, email and password. The pw is hashed, salted
        public object? CreateUser(string username, string email, string password)
        {
            _connectionString.Open();

            var generatedID = Guid.NewGuid().ToString();


            var hashedPW = Utils.HashPasword(password, out byte[] salt);

            using var command = new NpgsqlCommand(
                "INSERT INTO users (id, username, email_address, reg_time, password, salt) VALUES (:id, :username, :email_address, :reg_time, :password, :salt) RETURNING id",
                _connectionString
            );

            command.Parameters.AddWithValue(":id", generatedID);
            command.Parameters.AddWithValue(":username", username);
            command.Parameters.AddWithValue(":email_address", email);
            command.Parameters.AddWithValue(":reg_time", DateTime.UtcNow);
            command.Parameters.AddWithValue(":password", hashedPW);
            command.Parameters.AddWithValue(":salt", salt);

            var createdId = command.ExecuteScalar()?.ToString();

            _connectionString.Close();
            return createdId;
        }



        //authenticate
        public bool AuthUser(string usernameOrEmail, string password, out string? userID)
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
                _connectionString.Close();
                return Utils.VerifyPassword(password, storedHash, storedSalt);
            }

            _connectionString.Close();

            //if no such user found
            userID = null;
            return false;
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
