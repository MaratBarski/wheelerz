#pragma warning disable CS8618

namespace Wheelerz.DTO
{
    public class UserSelector: BaseReguest
    {
        public int countryId { get; set; }
        public int cityId { get; set; }
        public PageRequest page { get; set; }
    }
}
