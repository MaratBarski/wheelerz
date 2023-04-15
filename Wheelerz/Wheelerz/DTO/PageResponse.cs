#pragma warning disable CS8618

namespace Wheelerz.DTO
{
    public class PageResponse<T>
    {
        public int total { get; set; }
        public T result { get; set; } 
    }
}
