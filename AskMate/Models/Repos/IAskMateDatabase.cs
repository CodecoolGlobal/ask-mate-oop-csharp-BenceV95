namespace AskMate.Models.Repos
{
    public interface IAskMateDatabase
    {
        public List<Question> GetAllQuestions();
        public Task<Question> GetQuestion(string questionID);
        public string CreateNewQuestion(Question question);
        public void DeleteQuestion(string questionID);
        object? GetAnswer(string id);
        object? CreateNewAnswer(Answer answer);
        object? DeleteAnswer(string id);
        object? CreateUser(User user);
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