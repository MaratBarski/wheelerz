namespace Wheelerz.Helpers
{
    public enum Permissions
    {
        AddStory = 2,
        AddComment = 2 * 2
    }
    public static class Consts
    {
        public const string wheelchair = "wheelchair";
        public const string walker = "walker";
        public const string crutch = "crutch";
        public const string scooter = "scooter";

        public const bool IS_SOCKET_DISABLE = false;
        public const string ALL_CONNECTIONS = "all-connactions";
        public const string ONLINE_USERS = "online-users";
        public const string ADD_STORY = "add-story";
        public const string DELETE_COMMENT = "delete-comment";
        public const string ADD_COMMENT = "add-comment";

        public static List<string> Mobilities = new List<string> { wheelchair, walker, crutch, scooter };

        public static Dictionary<string, int> MobilitiesDictionary = new Dictionary<string, int>()
        {
            {wheelchair,2},
            {walker,4},
            {crutch,8},
            {scooter,16},
        };

        public static Dictionary<string, Dictionary<string, int>> ChairDictionary
            = new Dictionary<string, Dictionary<string, int>>()
            {
                {
                    "type_of_wheelchair",new Dictionary<string, int>{
                        {"manual",        2 },
                        {"motorized",     2*2 }
                    }
                },
                {
                    "assistance",new Dictionary<string, int>{
                        {"yes",        2*2*2 },
                        {"no",         2*2*2*2 }
                    }
                },
                {
                    "can_you_walk",new Dictionary<string, int>{
                        {"yes",        2*2*2*2*2 },
                        {"no",         2*2*2*2*2*2 }
                    }
                },
                {
                    "private_bath_chair",new Dictionary<string, int>{
                        {"yes",        2*2*2*2*2*2*2 },
                        {"no",         2*2*2*2*2*2*2*2 }
                    }
                },
                {
                    "contact_travelers",new Dictionary<string, int>{
                        {"yes",        2*2*2*2*2*2*2*2*2 },
                        {"no",         2*2*2*2*2*2*2*2*2*2 }
                    }
                }
            };
    }
}
