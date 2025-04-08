using AskMate.Models;
using AskMate.Models.Answers;
using AskMate.Models.Vote;
using Npgsql;
using System.Data;

namespace AskMate.Repos.Votes
{
    public class VotesRepo : IVotesRepo
    {
        private string _connectionString;
        public VotesRepo(string connectionString)
        {
            _connectionString = connectionString;
        }

        public Vote VoteOnAnswer(VoteCreateRequest voteCreateRequest)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            using var adapter = new NpgsqlDataAdapter("INSERT INTO votes (user_id,answer_id, is_useful) VALUES (:user_id, :answer_id, :is_useful) RETURNING id", connection);
            adapter.SelectCommand?.Parameters.AddWithValue(":user_id", voteCreateRequest.UserId);
            adapter.SelectCommand?.Parameters.AddWithValue(":answer_id", voteCreateRequest.AnswerId);
            adapter.SelectCommand?.Parameters.AddWithValue(":is_useful", voteCreateRequest.IsUseful);

            var voteId = (int)adapter.SelectCommand?.ExecuteScalar();

            Vote vote = new Vote()
            {
                Id = voteId,
                UserId = voteCreateRequest.UserId,
                AnswerId = voteCreateRequest.AnswerId,
                IsUseful = voteCreateRequest.IsUseful,
            };

            return vote;
        }
        public IEnumerable<Vote> GetVotesByAnswerIds(string[] answerIds)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            string query = "SELECT * FROM votes WHERE answer_id = ANY(@answerIds)";

            using var command = new NpgsqlCommand(query, connection);
            command.Parameters.AddWithValue("@answerIds", answerIds);

            List<Vote> votes = new List<Vote>();

            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                votes.Add(new Vote()
                {
                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                    UserId = reader.GetString(reader.GetOrdinal("user_id")),
                    AnswerId = reader.GetString(reader.GetOrdinal("answer_id")),
                    IsUseful = reader.GetBoolean(reader.GetOrdinal("is_useful"))
                });
            }

            return votes;
        }


        /// <summary>
        /// This should just change an existing vote from useful to not useful (vica-versa)
        /// </summary>
        /// <param VoteId="voteId"></param>
        public void ChangeVote(int voteId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            string query = " UPDATE votes SET is_useful = NOT is_useful  WHERE id = :voteId";

            using var command = new NpgsqlCommand(query, connection);
            command.Parameters.AddWithValue(":voteId", voteId);

            int rowsAffected = command.ExecuteNonQuery();
            if (rowsAffected == 0)
            {
                throw new Exception("Vote not found.");
            }
        }


        public void DeleteVote(int voteId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            string query = "DELETE FROM votes WHERE id = :voteId";

            using var command = new NpgsqlCommand(query, connection);
            command.Parameters.AddWithValue(":voteId", voteId);

            int rowsAffected = command.ExecuteNonQuery();
            if (rowsAffected == 0)
            {
                throw new Exception("Vote not found.");
            }
        }

        public decimal CalculateUserAnswersUsefulnessRatio(string userId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            string query = @"SELECT 
                NULLIF(COUNT(NULLIF(v.is_useful, false)), 0) / CAST(COUNT(v.is_useful) AS FLOAT)
                FROM public.answers a
                JOIN votes v ON v.answer_id = a.id
                WHERE a.user_id = @userId;";

            using var command = new NpgsqlCommand(query, connection);
            command.Parameters.AddWithValue("@userId", userId);

            var result = command.ExecuteScalar();
            return result == DBNull.Value || result == null ? 0 : Convert.ToDecimal(result);
        }
    }
}
