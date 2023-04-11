using Microsoft.EntityFrameworkCore;
using Wheelerz.Models;

namespace Wheelerz
{
    public class DataContext : DbContext
    {
#pragma warning disable CS8618
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<State> States { get; set; }
        public DbSet<Story> Stories { get; set; }
        public DbSet<Accessibility> Accessibilities { get; set; }
        public DbSet<AccessibilityItem> AccessibilityItems { get; set; }
        public DbSet<AccessibilityFile> AccessibilityFiles { get; set; }
        public DbSet<StoryPhoto> StoryPhotos { get; set; }
        public DbSet<UserMobility> UserMobilities { get; set; }
        public DbSet<ChairInfo> ChairInfos { get; set; }
        public DbSet<ChairOption> ChairOptions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            //modelBuilder.Entity<TBL_STATUS>()
            // .HasMany(e => e.TBL_TEST)
            // .WithRequired(e => e.TBL_STATUS)
            // .HasForeignKey(e => e.STATUS_ID)
            // .WillCascadeOnDelete(false);

            //modelBuilder.Entity<Country>().HasMany(x=>x.id).HasForeignKey(x=>x.CountryId);
            // modelBuilder.Entity<User>().HasMany(x => x.id);

        }
    }
}
