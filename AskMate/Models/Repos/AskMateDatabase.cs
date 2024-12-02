using AskMate.Models.QuestionModel;
using Npgsql;
using System.Data.Common;
using System.Data;


namespace AskMate.Models.Repos
{
    public class AskMateDatabase : IAskMateDatabase
    {
        NpgsqlConnection _connectionString; //maybe this culd use an interface
        public AskMateDatabase(NpgsqlConnection connectionString)
        {
            _connectionString = connectionString;
        }

        public Question CreateNewQuestion(Question question)
        {
            throw new NotImplementedException();
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


        public Question GetQuestion(int questionID) //not sure how the related answers should be given  back, atm the question has a property which stores the related answer ids
        {
            _connectionString.Open();
            var adapter = new NpgsqlDataAdapter("SELECT * FROM questions WHERE id = :questionID", _connectionString);
            adapter.SelectCommand?.Parameters.AddWithValue(":id", questionID);

            var dataSet = new DataSet();
            adapter.Fill(dataSet);
            var table = dataSet.Tables[0];

            if (table.Rows.Count > 0)
            {
                DataRow row = table.Rows[0];
                return new Question(
                    (string)row["id"],
                    (string)row["user_id"],
                    (string)row["body"]
                    );
            }

            _connectionString.Close();

            return null;
        }
    }

}

