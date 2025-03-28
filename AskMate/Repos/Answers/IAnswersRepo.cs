using AskMate.Models.Answers;
using AskMate.Models.Users;

namespace AskMate.Repos.Answers
{
    public interface IAnswersRepo
    {
        public object? GetAnswer(string id);
        public object? CreateNewAnswer(Answer answer, string loggedInUserID);
        public void DeleteAnswer(string id);
        public void UpdateAnswer(Answer answer);
        public void AcceptAnswer(string answerId);
        public bool IsAnswerBelongToLoggedInUsersQuestion(string loggedInUserID, string answerId);
        public void DeleteAnswerByQuestionId(string id);
        public List<Answer>? GetAllAnswersByQuestionId(string id); //should return empty, never with null!
        public List<Answer> GetAllAnswersByUserId(string userId);
    }
}
