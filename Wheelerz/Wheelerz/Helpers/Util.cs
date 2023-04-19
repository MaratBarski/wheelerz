#pragma warning disable CS8603

namespace Wheelerz.Helpers
{
    public static class Util
    {
        public static DateTime ParseDate(string str, DateTime defaultDate)
        {
            if (string.IsNullOrEmpty(str)) return defaultDate;
            try
            {
                string[] s = str.Split('/');
                return new DateTime(int.Parse(s[2]), int.Parse(s[1]), int.Parse(s[0])).Date;
            }
            catch
            {
                return defaultDate;
            }
        }

        public static string GetQueryParam(HttpRequest request,string name, object defaultValue)
        {
            if(request.Query.TryGetValue(name, out var value))
                return value.ToString();
            
            return defaultValue.ToString();
        }
    }
}
