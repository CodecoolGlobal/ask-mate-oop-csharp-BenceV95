﻿namespace AskMate.Models
{
    public class Question
    {

        public string ID { get; init; }
        public string UserId { get; init; }
        public string Body { get; init; }
        public string Title { get; init; }
        public DateTime PostDate { get; init; }
        public List<string> RelatedAnswersIDs { get; set; } = new List<string>();


    }
}
