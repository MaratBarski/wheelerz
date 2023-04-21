using System.ComponentModel.DataAnnotations.Schema;

namespace Wheelerz.Models
{
    public class StoryComment
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Column("storyId")]
        public int storyId { get; set; }

        [Column("userId")]
        public int userId { get; set; }

        [Column("dateAdd")]
        public DateTime dateAdd { get; set; }

        [Column("deleted")]
        public int deleted { get; set; }

        [Column("text")]
        public string? text { get; set; }

        public User? user { get; set; }

        [NotMapped]
        public bool isMy { get; set; }
    }
}
