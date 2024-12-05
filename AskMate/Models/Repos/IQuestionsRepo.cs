namespace AskMate.Models.Repos
{
    public interface IQuestionsRepo
    {
        public List<Question> GetAllQuestions();
        public Task<Question> GetQuestion(string questionID);
        public string CreateNewQuestion(Question question, string loggedInUserID);
        public void DeleteQuestion(string questionID);
    }
}
