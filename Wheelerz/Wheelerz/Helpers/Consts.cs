﻿namespace Wheelerz.Helpers
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
