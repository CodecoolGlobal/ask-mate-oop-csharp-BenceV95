namespace AskMate.Models.QuestionModel
{
    public class Question
    {
        public string ID { get; init; }
        public string UserID { get; init; }
        public string Body { get; init; }
        //public List<int> RelatedAnswersIDs { get; init; }

        public Question(string id, string userID, string body)
        {
            ID = id;
            UserID = userID;
            Body = body;
        }

    }
}
