﻿namespace Wheelerz.Models
{
    public class LoginRequest
    {
        public string email { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public string key { get; set; } = string.Empty;
        public string error { get; set; } = string.Empty;
        public string firstName { get; set; } = string.Empty;
        public string lastName { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string token { get; set; } = string.Empty;
        public int role { get; set; }
        public int permission { get; set; }
    }

    public class RegistrRequest
    {
        public string email { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
        public string firstName { get; set; } = string.Empty;
        public string lastName { get; set; } = string.Empty;
        public int birthYear { get; set; }
        public string confirmPassword { get; set; } = string.Empty;
        public string phone { get; set; } = string.Empty;
        public int countryId { get; set; }
        public int stateId { get; set; }
        public int sex { get; set; }
        public string? birthDayDisplay { get; set; }
        public int permission { get; set; }
    }
}
