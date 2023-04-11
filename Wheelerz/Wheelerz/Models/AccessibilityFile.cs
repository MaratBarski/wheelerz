using System.ComponentModel.DataAnnotations.Schema;

namespace Wheelerz.Models
{
    public class AccessibilityFile
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Column("userId")]
        public int userId { get; set; }

        [Column("accessibilityId")]
        public int accessibilityId { get; set; }

        [Column("fileName")]
        public string? fileName { get; set; }

        [Column("small")]
        public string? small { get; set; }
    }
}
