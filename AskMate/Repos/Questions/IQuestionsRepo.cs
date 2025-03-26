using AskMate.Models.Questions;

namespace AskMate.Repos.Questions
{
    public interface IQuestionsRepo
    {
        public List<Question> GetAllQuestions();
        public Task<Question> GetQuestion(string questionID);
        public List<Question> GetQuestions(int? categoryId, int limit);
        public string CreateNewQuestion(Question question, string loggedInUserID);
        public void DeleteQuestion(string questionID);
        List<Question>? Search(string query);
    }
}
