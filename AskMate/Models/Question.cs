﻿namespace AskMate.Models
{
    public class Question
    {
        public string ID { get; init; }
        public string UserID { get; init; }
        public string Body { get; init; }
        public List<string> RelatedAnswersIDs { get; set; } = new List<string>();
        public DateTime PostDate { get; init; }

        public Question(string id, string userID, string body, DateTime postDate)
        {
            ID = id;
            UserID = userID;
            Body = body;
            PostDate = postDate;
        }

    }
}
