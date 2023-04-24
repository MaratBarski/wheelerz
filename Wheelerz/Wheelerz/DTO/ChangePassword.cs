namespace Wheelerz.DTO
{
    public class ChangePassword
    {
        public string? email { get; set; }
        public string? oldPwd { get; set; }
        public string? newPwd { get; set; } 
        public string? confirmPwd { get; set; } 
    }

    public class ChangePasswordResponse
    {
        public string? message { get; set; }
    }
}
