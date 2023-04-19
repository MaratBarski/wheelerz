#pragma warning disable CS8618

namespace Wheelerz.DTO
{
    public abstract class BaseReguest
    {
        public int userId { get; set; }
        public string? q { get; set; }
    }
}
