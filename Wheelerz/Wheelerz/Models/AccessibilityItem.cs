using System.ComponentModel.DataAnnotations.Schema;


namespace Wheelerz.Models
{
    public class AccessibilityItem
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Column("userId")]
        public int userId { get; set; }

        [Column("accessibilityId")]
        public int accessibilityId { get; set; }

        [Column("key")]
        public string? key { get; set; }

        [Column("selectedKey")]
        public string? selectedKey { get; set; }

        [Column("selectedValue")]
        public string? selectedValue { get; set; }

        [Column("name")]
        public string? name { get; set; }
    }
}