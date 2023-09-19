using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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

        [Column("hebname")]
        [Required]
        public string? hebname { get; set; }

        public List<State>? states { get; set; }

        [Column("deleted")]
        public int deleted { get; set; }
    }

    public class State
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Column("countryId")]
        [Required]
        public int countryId { get; set; }

        [JsonIgnore]
        public Country? country { get; set; }

        [Column("name")]
        [Required]
        public string? name { get; set; }

        [Column("deleted")]
        public int deleted { get; set; }
    }
}
