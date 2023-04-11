using Wheelerz.Models;

namespace Wheelerz.DTO
{
    public class MobilityDto
    {
        public List<UserMobility>? mobilities { get; set; }
        public List<ChairOption>? chairOptions { get; set; }
        public ChairInfo? chairInfo { get; set; }
    }
}
