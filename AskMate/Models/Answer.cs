namespace AskMate.Models
{
    public class Answer
    {
        public string id { get; set; }
        public string user_id { get; set; }
        public string question_id { get; set; }
        public string body { get; set; }
        public bool is_accepted { get; set; }

    }
}
