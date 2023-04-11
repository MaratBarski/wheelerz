using System.ComponentModel.DataAnnotations.Schema;

namespace Wheelerz.Models
{
    public class StoryPhoto
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Column("storyId")]
        public int storyId { get; set; }

        [Column("small")]
        public string? small { get; set; }

        [Column("fileName")]
        public string? fileName { get; set; }
    }
}
