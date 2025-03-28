using AskMate.Models.Users;

namespace AskMate.Repos.Users
{
    public interface IUserRepo
    {
        public bool IsAnswerBelongToLoggedInUsersQuestion(string loggedInUserID, string answerId);
        public int CalculateUserPoints(string userID);
        public bool ValidUser(string userID);
        object? CreateUser(string username, string email, string password);
        bool AuthUser(string usernameOrEmail, string password, out User user);
        List<User> GetAllUsers();
        void DeleteUser(string id);
        public (List<User> users, int totalCount) GetUsersPaginated(int pageNumber, int limit);
        public User? GetUserByNameOrEmail(string nameOrEmail);
        public void UpdateUser(string id, UserUpdateRequest updateRequest);
    }
}
