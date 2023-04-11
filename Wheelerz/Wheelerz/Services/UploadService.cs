using Wheelerz.Models;

namespace Wheelerz.Services
{
    public interface IUploadService
    {
        string GetUploadDir();
        string SaveFile(string content);
        void SaveFile(string content, string name);
        void DeleteFile(string fileName);
        string GetFileText(string image);
        string GetImageText(string fileName);
        byte[] GetImageBytes(string fileName);
        string SaveFile(FileImage fi);
    }
    public class UploadService : IUploadService
    {
        public void DeleteFile(string fileName)
        {
            if (string.IsNullOrEmpty(fileName)) return;
            try
            {
                File.Delete(Path.Combine(GetUploadDir(), fileName));
                File.Delete(Path.Combine(GetUploadDir(), "p" + fileName));
            }
            catch { }
        }
        public string SaveFile(FileImage fi)
        {
            var fileName = SaveFile(fi.big);
            SaveFile(fi.small, "p" + fileName);
            return fileName;
        }

        public string GetImageText(string fileName)
        {
            return this.GetFileText(fileName).Replace("data:image/jpeg;base64,", "");
        }

        public byte[] GetImageBytes(string fileName)
        {
            var str = GetImageText(fileName);
            var bytes = Convert.FromBase64String(str);
            return bytes;
        }

        public string GetFileText(string image)
        {
            var filePath = Path.Combine(GetUploadDir(), image);
            if (!System.IO.File.Exists(filePath)) return "";

            using (StreamReader sr = new StreamReader(filePath))
            {
                return sr.ReadToEnd();
            }
        }

        public string GetUploadDir()
        {
            return Path.Combine(Directory.GetCurrentDirectory(), "Upload");
        }

        public string SaveFile(string content)
        {
            var name = Guid.NewGuid().ToString() + ".txt";
            var path = Path.Combine(GetUploadDir(), name);
            using (StreamWriter sw = new StreamWriter(path))
            {
                sw.Write(content);
            }
            return name;
        }

        public void SaveFile(string content, string name)
        {
            var path = Path.Combine(GetUploadDir(), name);
            using (StreamWriter sw = new StreamWriter(path))
            {
                sw.Write(content);
            }
        }
    }
}
