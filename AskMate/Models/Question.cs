namespace AskMate.Models
{
    public class Question
    {

        public string Body { get; init; }
        public List<string> RelatedAnswersIDs { get; set; } = new List<string>();
        public DateTime PostDate { get; init; }
        public string? Title { get; init; }
        public string ID { get; init; }
        public string UserId { get; init; }


    }
}
