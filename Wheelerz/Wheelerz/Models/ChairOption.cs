using System.ComponentModel.DataAnnotations.Schema;

namespace Wheelerz.Models
{
    public class ChairOption
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Column("userId")]
        public int userId { get; set; }

        [Column("key")]
        public string? key { get; set; }

        [Column("value")]
        public string? value { get; set; }

    }
}
