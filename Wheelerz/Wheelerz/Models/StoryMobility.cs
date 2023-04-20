using System.ComponentModel.DataAnnotations.Schema;

namespace Wheelerz.Models
{
    public class StoryMobility
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Column("storyId")]
        public int storyId { get; set; }

        [Column("name")]
        public string name { get; set; } = string.Empty;

    }
}
