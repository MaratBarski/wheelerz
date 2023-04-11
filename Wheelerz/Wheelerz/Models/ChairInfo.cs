using System.ComponentModel.DataAnnotations.Schema;


namespace Wheelerz.Models
{
    public class ChairInfo
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Column("userId")]
        public int userId { get; set; }

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
