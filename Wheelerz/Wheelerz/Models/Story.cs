using System.ComponentModel.DataAnnotations.Schema;

namespace Wheelerz.Models
{
    public class Story
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Column("userId")]
        public int userId { get; set; }

        [Column("key")]
        public string? key { get; set; }

        [Column("name")]
        public string? name { get; set; }

        [Column("city")]
        public string? city { get; set; }

        [Column("title")]
        public string? title { get; set; }

        [Column("country")]
        public string? country { get; set; }

        [Column("estimation")]
        public int estimation { get; set; }

        [Column("comments")]
        public string? comments { get; set; }

        [Column("storyType")]
        public int storyType { get; set; }

        [Column("startDate")]
        public DateTime startDate { get; set; }

        [Column("endDate")]
        public DateTime endDate { get; set; }

        public List<Accessibility>? accessibility { get; set; }

        public User? user { get; set; }

        public List<StoryPhoto>? storyPhotos { get; set; }

        [NotMapped]
        public List<FileImage>? photos { get; set; }

    }
}
