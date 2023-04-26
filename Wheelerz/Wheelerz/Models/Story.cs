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

        [Column("approved")]
        public int approved { get; set; }

        [Column("key")]
        public string? key { get; set; }

        [Column("name")]
        public string? name { get; set; }

        [Column("countryId")]
        public int countryId { get; set;}

        [Column("cityId")]
        public int cityId { get; set; }

        [Column("width")]
        public double width { get; set; }

        [Column("length")]
        public double length { get; set; }

        [Column("height")]
        public double height { get; set; }

        [Column("title")]
        public string? title { get; set; }

        [Column("estimation")]
        public int estimation { get; set; }

        [Column("comments")]
        public string? comments { get; set; }

        [Column("lang")]
        public string? lang { get; set; }

        [Column("storyType")]
        public int storyType { get; set; }

        [Column("startDate")]
        public DateTime startDate { get; set; }

        [Column("endDate")]
        public DateTime endDate { get; set; }

        [Column("dateAdd")]
        public DateTime dateAdd { get; set; }

        [Column("deleted")]
        public int deleted { get; set; }

        [Column("phone")]
        public string? phone { get; set; }

        [Column("map")]
        public string? map { get; set; }

        [Column("address")]
        public string? address { get; set; }

        [Column("mail")]
        public string? mail { get; set; }

        [Column("link")]
        public string? link { get; set; }

        [Column("mainImage")]
        public string? mainImage { get; set; }

        [Column("mobilityNumber")]
        public int mobilityNumber { get; set; }

        [Column("chairNumber")]
        public int chairNumber { get; set; }
        public List<Accessibility>? accessibility { get; set; }
        public List<StoryMobility>? mobilities { get; set; }
        public User? user { get; set; }

        public ChairStoryInfo? chairInfo { get; set; }
        public List<StoryPhoto>? storyPhotos { get; set; }
        public State? city { get; set; }
        public Country? country { get; set; }

        public List<StoryComment>? userComments { get; set; }

        [NotMapped]
        public List<FileImage>? photos { get; set; }

        [NotMapped]
        public string? startDateDisplay { get; set; }

        [NotMapped]
        public string? endDateDisplay { get; set; }

        [NotMapped]
        public string? mapStr { get; set; }

    }
}
