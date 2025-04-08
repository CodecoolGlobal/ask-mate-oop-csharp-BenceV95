namespace AskMate.Models.Users
{
    public record UserUpdateRequest
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

    }
}
