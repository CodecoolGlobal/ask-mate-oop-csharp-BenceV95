namespace AskMate.Models.Vote
{
    public class Vote
    {
        public int Id { get; set; }
        public bool IsUseful { get; set; }
        public string UserId { get; set; }
        public string AnswerId { get; set; }
    }
}
