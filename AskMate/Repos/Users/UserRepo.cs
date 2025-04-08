using AskMate.Models.Users;
using AskMate.Repos.Users;
using Npgsql;
using System.Data;
using System.Security.Cryptography;
using System.Text;

namespace AskMate.Repos
{
    public class UserRepo : IUserRepo
    {
        string _connectionString;


        public UserRepo(string connectionString)
        {
            _connectionString = connectionString;
        }


        public User? GetUserByNameOrEmail(string nameOrEmail)
        {
            User? user = null;

            using var connection = new NpgsqlConnection(_connectionString);
            {
                connection.Open();

                var command = new NpgsqlCommand(@"
                    SELECT * FROM users
                    WHERE username = :nameOrEmail
                    OR email_address = :nameOrEmail
                    OR id = :nameOrEmail", connection);
                command.Parameters.AddWithValue(":nameOrEmail", nameOrEmail);

                using var reader = command.ExecuteReader();
                {
                    while (reader.Read())
                    {
                        user = new User()
                        {
                            Id = reader.GetString(reader.GetOrdinal("id")),
                            Username = reader.GetString(reader.GetOrdinal("username")),
                            Email = reader.GetString(reader.GetOrdinal("email_address")),
                            Role = reader.GetBoolean(reader.GetOrdinal("isadmin")) ? "admin" : "user"
                        };
                    }
                }
            }

            return user;
        }

        public void UpdateUser(string id, UserUpdateRequest updateRequest)
        {
            bool updatePassword = !string.IsNullOrWhiteSpace(updateRequest.Password);
            string? hashedPW = null;
            byte[]? salt = null;

            if (updatePassword)
            {
                hashedPW = Utils.HashPassword(updateRequest.Password, out salt);
            }

            string cmd = @"
                UPDATE users
                SET username = @newUsername,
                email_address = @newEmailAddress" + 
                         (updatePassword ? ", password = @password, salt = @salt" : "") + @"
                WHERE id = @userId";

            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            using var command = new NpgsqlCommand(cmd, connection);
            command.Parameters.AddWithValue("@newUsername", updateRequest.Username);
            command.Parameters.AddWithValue("@newEmailAddress", updateRequest.Email);
            command.Parameters.AddWithValue("@userId", id);

            if (updatePassword)
            {
                command.Parameters.AddWithValue("@password", hashedPW);
                command.Parameters.AddWithValue("@salt", salt);
            }

            command.ExecuteNonQuery();
        }



        //using tuple
        public (List<User> users, int totalCount) GetUsersPaginated(int pageNumber, int limit)
        {
            List<User> users = new List<User>();
            int totalCount = 0;

            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();


                var command = new NpgsqlCommand("SELECT * FROM users ORDER BY username LIMIT :limit OFFSET (:pageNumber - 1 ) * :limit", connection);
                command.Parameters.AddWithValue(":limit", limit);
                command.Parameters.AddWithValue(":pageNumber", pageNumber);
                using var reader = command.ExecuteReader();
                {
                    while (reader.Read())
                    {
                        var user = new User
                        {
                            Id = reader.GetString(reader.GetOrdinal("id")),
                            Username = reader.GetString(reader.GetOrdinal("username")),
                            Email = reader.GetString(reader.GetOrdinal("email_address"))
                        };

                        users.Add(user);
                    }

                }


            }
            //open a 2nd connection to get the count
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();
                var countQuery = new NpgsqlCommand("SELECT COUNT(*) FROM users", connection);
                totalCount = Convert.ToInt32(countQuery.ExecuteScalar());
            }
            return (users, totalCount);
        }

        public List<User> GetAllUsers()
        {
            List<User> users = new List<User>();

            // Create and use a new connection instance
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();
                using (var command = new NpgsqlCommand("SELECT id, username, email_address, isAdmin FROM users", connection))
                {
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            users.Add(new User()
                            {
                                Id = reader.GetString(reader.GetOrdinal("id")),
                                Username = reader.GetString(reader.GetOrdinal("username")),
                                Email = reader.GetString(reader.GetOrdinal("email_address")),
                                Role = reader.GetBoolean(reader.GetOrdinal("isAdmin")) ? "admin" : "user"
                            });
                        }
                    }
                }
            }

            return users;
        }

        public int CalculateUserPoints(string userID)
        {
            try
            {
                using (var connection = new NpgsqlConnection(_connectionString))
                {
                    connection.Open();

                    // SQL query to calculate total points
                    using var adapter = new NpgsqlDataAdapter(@"
                 SELECT  users.id, (SELECT COUNT(*) * 5
                 FROM questions
                 WHERE questions.user_id = users.id) + (SELECT COUNT(*) * 10
                 FROM answers
                 INNER JOIN questions ON answers.question_id = questions.id
                 WHERE answers.user_id = users.id AND questions.user_id != users.id) + (SELECT COUNT(*) * 1 
                 FROM answers
                 INNER JOIN questions ON answers.question_id = questions.id
                 WHERE questions.user_id = users.id AND answers.user_id != users.id) AS total_points
                 FROM users
                 WHERE users.id = :userID", connection);

                    adapter.SelectCommand?.Parameters.AddWithValue(":userID", userID);

                    var dataSet = new DataSet();
                    adapter.Fill(dataSet);
                    var table = dataSet.Tables[0];

                    if (table.Rows.Count > 0)
                    {
                        var row = table.Rows[0];
                        Console.WriteLine($"User ID: {row["id"]}, Total Points: {row["total_points"]}");


                        return Convert.ToInt32(row["total_points"]);
                    }
                }

            }
            catch (Exception ex)
            {

            }

            return 0;
        }

        public bool ValidUser(string userID)
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                using var adapter = new NpgsqlDataAdapter("SELECT * FROM users WHERE id = :userID;", _connectionString);
                adapter.SelectCommand?.Parameters.AddWithValue(":userID", userID);
                if (adapter.SelectCommand.ExecuteScalar() != null)
                {
                    // _connectionString.Close();
                    return true;
                }
                // _connectionString.Close();
                return false;
            }

        }

        // this creates a new user in the database with given username, email and password. The pw is hashed, salted
        public object? CreateUser(string username, string email, string password)
        {

            var checkForUserAlreadyRegisteredByUsername = GetUserByNameOrEmail(username);
            if (checkForUserAlreadyRegisteredByUsername != null)
            {
                throw new Exception("Username is already taken !");
            }

            var checkForUserAlreadyRegisteredByEmail = GetUserByNameOrEmail(email);
            if (checkForUserAlreadyRegisteredByEmail != null)
            {
                throw new Exception("Email is already in use !");
            }

            using var connection = new NpgsqlConnection(_connectionString);

            connection.Open();

            var generatedID = Guid.NewGuid().ToString();


            var hashedPW = Utils.HashPassword(password, out byte[] salt);

            using var command = new NpgsqlCommand(
                @"INSERT INTO users
                (id, username, email_address, reg_time, password, salt)
                VALUES (:id, :username, :email_address, :reg_time, :password, :salt)
                RETURNING id", connection);

            command.Parameters.AddWithValue(":id", generatedID);
            command.Parameters.AddWithValue(":username", username);
            command.Parameters.AddWithValue(":email_address", email);
            command.Parameters.AddWithValue(":reg_time", DateTime.UtcNow);
            command.Parameters.AddWithValue(":password", hashedPW);
            command.Parameters.AddWithValue(":salt", salt);

            var createdId = command.ExecuteScalar()?.ToString();

            // _connectionString.Close();
            return createdId;
        }


        public void DeleteUser(string id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            using var command = new NpgsqlCommand("DELETE FROM ONLY users WHERE id = @id", connection);
            command.Parameters.AddWithValue("@id", id);

            var rowsAffected = command.ExecuteNonQuery();
            Console.WriteLine("Rows affected: " + rowsAffected);

            if (rowsAffected == 0)
            {
                throw new ArgumentException("User not found");
            }
        }



        //authenticate
        public bool AuthUser(string usernameOrEmail, string password, out User user)
        {

            using var connection = new NpgsqlConnection(_connectionString);

            connection.Open();

            using var adapter = new NpgsqlDataAdapter(
                @"SELECT * FROM users
                                WHERE username = :usernameOrEmail OR email_address = :usernameOrEmail ", connection);

            adapter.SelectCommand?.Parameters.AddWithValue(":usernameOrEmail", usernameOrEmail);

            var dataSet = new DataSet();
            adapter.Fill(dataSet);
            var table = dataSet.Tables[0];

            if (table.Rows.Count > 0)
            {
                DataRow row = table.Rows[0];

                var storedHash = (string)row["password"];
                var storedSalt = (byte[])row["salt"];
                var userID = (string)row["id"];
                var isAdmin = (bool)row["isAdmin"];
                var username = (string)row["username"];
                var email = (string)row["email_address"];
                user = new() { Id = userID, Role = isAdmin ? "admin" : "user", Username = username, Email = email };
                return Utils.VerifyPassword(password, storedHash, storedSalt);
            }

            // _connectionString.Close();

            //if no such user found
            user = new() { Id = null, Role = "user" };
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
                    //_connectionString.Close();
                    return true;
                }

            }
            //_connectionString.Close();
            return false;

        }
    }

    //TODO: organize classes better! We don't need so many similar classes (multiple users)

    //Also, don't forget to make the db not to require a isAdmin to be passed, cause thats illogical to do so when someone registers! they should be "users" automatically!

}
