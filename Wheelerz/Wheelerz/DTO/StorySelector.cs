#pragma warning disable CS8618

namespace Wheelerz.DTO
{
    public class StorySelector : BaseReguest
    {
        public int countryId { get; set; }
        public int cityId { get; set; }
        public bool isMyInclude { get; set; }
        public bool isOnlyMy { get; set; }
        public Dictionary<string, bool> mobilities { get; set; }
        public int type { get; set; }
        public bool byStoryMob { get; set; }
        public PageRequest page { get; set; }
    }
}
