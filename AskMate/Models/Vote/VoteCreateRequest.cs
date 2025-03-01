namespace AskMate.Models.Vote
{
    public class VoteCreateRequest
    {
        public bool IsUseful { get; set; }
        public string UserId { get; set; }
        public string AnswerId { get; set; }
    }
}
