using AskMate.Models.Vote;

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
            throw new NotImplementedException();
        }
        public IEnumerable<Vote> GetVotesByAnswerIds(string[] answerIds)
        {
            throw new NotImplementedException();
        }

        public void ChangeVote(string voteId)
        {
            throw new NotImplementedException();
        }

        public void DeleteVote(string voteId)
        {
            throw new NotImplementedException();
        }


    }
}
