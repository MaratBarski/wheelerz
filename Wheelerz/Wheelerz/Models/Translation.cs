using System.ComponentModel.DataAnnotations.Schema;

namespace Wheelerz.Models
{
    public class Translation
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Column("key")]
        public string? key { get; set; }

        [Column("lang")]
        public string? lang { get; set; }

        [Column("text")]
        public string? text { get; set; }

    }
}
