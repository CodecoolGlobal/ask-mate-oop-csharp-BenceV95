namespace AskMate.Models.Answers
{
    public class Answer
    {
        public string ID { get; set; }
        public string UserId { get; set; }
        public string QuestionID { get; set; }
        public string Body { get; set; }
        public DateTime PostDate { get; set; }
        public bool IsAccepted { get; set; }

    }
}
