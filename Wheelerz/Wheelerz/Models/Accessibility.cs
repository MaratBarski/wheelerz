using System.ComponentModel.DataAnnotations.Schema;

namespace Wheelerz.Models
{
    public class Accessibility
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Column("userId")]
        public int userId { get; set; }

        [Column("storyId")]
        public int storyId { get; set; }

        [Column("key")]
        public string? key { get; set; }

        [Column("name")]
        public string? name { get; set; }

        [Column("comments")]
        public string? comments { get; set; }

        public List<AccessibilityItem>? accessibilityItems { get; set; }

        public List<AccessibilityFile>? files { get; set; }

        [NotMapped]
        public List<FileImage>? photos { get; set; }

    }
}
