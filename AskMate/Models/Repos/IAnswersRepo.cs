namespace AskMate.Models.Repos
{
    public interface IAnswersRepo
    {
        public object? GetAnswer(string id);
        public object? CreateNewAnswer(Answer answer, string loggedInUserID);
        public void DeleteAnswer(string id);
        public void UpdateAnswer(Answer answer);
        public void AcceptAnswer(string answerId);
        public bool IsAnswerBelongToLoggedInUsersQuestion(string loggedInUserID, string answerId);
    }
}
