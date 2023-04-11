﻿using System.ComponentModel.DataAnnotations.Schema;

namespace Wheelerz.Models
{
    public class User
    {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Column("role")]
        public int role { get; set; }

        [Column("countryId")]
        public int countryId { get; set; }

        [Column("stateId")]
        public int stateId { get; set; }

        [Column("sex")]
        public int sex { get; set; }

        [Column("firstName")]
        public string firstName { get; set; } = string.Empty;

        [Column("lastName")]
        public string lastName { get; set; } = string.Empty;

        [Column("deleted")]
        public int deleted { get; set; }

        [Column("noWalk")]
        public int noWalk { get; set; }

        [Column("email")]
        public string email { get; set; } = string.Empty;

        [Column("password")]
        public string? password { get; set; } = string.Empty;

        [Column("key")]
        public string? key { get; set; } = string.Empty;

        [Column("birthDay")]
        public DateTime birthDay { get; set; }

        [Column("registrDate")]
        public DateTime registrDate { get; set; }

        [Column("phone")]
        public string phone { get; set; } = string.Empty;

        [Column("avatar")]
        public string? avatar { get; set; }

        [ForeignKey("countryId")]
        public Country? country { get; set; }

        [ForeignKey("stateId")]
        public State? state { get; set; }

        public List<UserMobility>? mobilities { get; set; }
        public ChairInfo? chairInfo { get; set; }
        public List<ChairOption>? chairOptions { get; set; }

        [NotMapped]
        public List<Story>? stories { get; set; }

    }
}
