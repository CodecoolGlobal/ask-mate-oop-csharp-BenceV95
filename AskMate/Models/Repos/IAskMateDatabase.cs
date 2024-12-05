using System.Diagnostics.Eventing.Reader;

namespace AskMate.Models.Repos
{
    public interface IAskMateDatabase
    {
        // questions
        public List<Question> GetAllQuestions();
        public Task<Question> GetQuestion(string questionID);
        public string CreateNewQuestion(Question question, string loggedInUserID);
        public void DeleteQuestion(string questionID);

        // answers
        public object? GetAnswer(string id);
        public object? CreateNewAnswer(Answer answer, string loggedInUserID);
        public void DeleteAnswer(string id);
        public void UpdateAnswer(Answer answer);
        public void AcceptAnswer(string answerId);
        public bool IsAnswerBelongToLoggedInUsersQuestion(string loggedInUserID, string answerId);
        public int CalculateUserPoints(string userID);
        public bool ValidUser(string userID);


        // user
        object? CreateUser(string username, string email, string password);

        //authenticate user
        bool AuthUser(string usernameOrEmail, string password, out string? userID);
    }
}


//Get all the questions
//Create an endpoint to retrieve all the questions.

//An endpoint called /Question exists.

//The endpoint uses the GET request method.

//The data is sorted by starting with the most recent one.

//CRITERIA
//Get one question
//Create an endpoint to retrieve one question (with the related answers) by its id.

//An endpoint called /Question/{id} exists.

//The endpoint uses the GET request method.

//CRITERIA
//Create a question
//Create an endpoint to create a new question.

//An endpoint called / Question exists.

//The endpoint uses the POST request method.

//A question has at least an id, a title, a description, and a submission_time.

//The endpoint returns the id of the new question entry.