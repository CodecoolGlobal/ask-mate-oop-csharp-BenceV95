using AskMate.Models;
using AskMate.Models.Vote;

namespace AskMate.Repos.Votes
{
    public interface IVotesRepo
    {

        public Vote VoteOnAnswer(VoteCreateRequest voteCreateRequest);
        public IEnumerable<Vote> GetVotesByAnswerIds(string[] answerIds);
        public void ChangeVote(string voteId);
        public void DeleteVote(string voteId);

    }
}
