using System.ComponentModel.DataAnnotations.Schema;

namespace Wheelerz.Models
{
    public class UserMobility
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Column("userId")]
        public int userId { get; set; }

        [Column("name")]
        public string name { get; set; } = string.Empty;

        [NotMapped]
        public bool noWalk { get; set; }
    }
}
