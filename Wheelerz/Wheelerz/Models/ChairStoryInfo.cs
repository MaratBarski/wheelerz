using System.ComponentModel.DataAnnotations.Schema;


namespace Wheelerz.Models
{
    public class ChairStoryInfo
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Column("storyId")]
        public int storyId { get; set; }

        [Column("width")]
        public double width { get; set; }

        [Column("length")]
        public double length { get; set; }

        [Column("seatHeight")]
        public double seatHeight { get; set; }

        [Column("messure")]
        public string? messure { get; set; }
    }
}
