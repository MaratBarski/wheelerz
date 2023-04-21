namespace Wheelerz.Helpers
{
    public static class Consts
    {
        public const string wheelchair = "wheelchair";
        public const string walker = "walker";
        public const string crutch = "crutch";
        public const string scooter = "scooter";

        public static List<string> Mobilities = new List<string> { wheelchair, walker, crutch, scooter };

        public static Dictionary<string, int> MobilitiesDictionary = new Dictionary<string, int>()
        {
            {wheelchair,2},
            {walker,4},
            {crutch,8},
            {scooter,16},
        };
    }
}
