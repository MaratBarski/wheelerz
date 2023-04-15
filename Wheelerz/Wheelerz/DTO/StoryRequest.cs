#pragma warning disable CS8618
#pragma warning disable CS8618

namespace Wheelerz.DTO
{
    public class StoryRequest : BaseReguest
    {
        public int type { get; set; }
        public PageRequest page { get; set; }
    }
}
