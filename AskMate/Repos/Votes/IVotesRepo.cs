using AskMate.Models;
using AskMate.Models.Vote;

namespace AskMate.Repos.Votes
{
    public interface IVotesRepo
    {

        public Vote VoteOnAnswer(VoteCreateRequest voteCreateRequest);
        public IEnumerable<Vote> GetVotesByAnswerIds(string[] answerIds);
        public void ChangeVote(int voteId);
        public void DeleteVote(int voteId);

        float CalculateUserAnswersUsefulnessRatio(string userId);
    }
}
