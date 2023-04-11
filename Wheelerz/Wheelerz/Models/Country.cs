using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wheelerz.Models
{
    public class Country
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        [Column("name")]

        [Required]
        public string? name { get; set; }

        public List<State>? states { get; set; }
    }

    public class State
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Column("countryId")]
        [Required]
        public int countryId { get; set; }

        [Column("name")]
        [Required]
        public string? name { get; set; }
    }
}
