namespace Wheelerz.Helpers
{
    public static class Util
    {
        public static DateTime ParseDate(string str)
        {
            try
            {
                string[] s = str.Split('-');
                return new DateTime(int.Parse(s[0]), int.Parse(s[1]), int.Parse(s[2])).Date;
            }
            catch
            {
                return DateTime.MinValue;
            }
        }
    }
}
