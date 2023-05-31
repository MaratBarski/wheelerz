using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Wheelerz.Models;

#pragma warning disable CS8618

namespace Wheelerz
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            init();
        }

        private void init()
        {
            //try
            //{
            //    var service = Database.GetService<IRelationalDatabaseCreator>();
            //    if (service == null) return;
            //    if (!service.CanConnect()) service.Create();
            //    if (!service.HasTables())
            //    {
            //        service.CreateTables();
            //        //FillTables();
            //    }
            //}
            //catch(Exception ex)
            //{
            //    Console.Error.WriteLine(ex);
            //}
        }

        private void FillTables()
        {
            using (var sr = new StreamReader(Path.Combine(Directory.GetCurrentDirectory(), "Data", "init-data.txt")))
            {
                var str = sr.ReadToEnd();
                Database.ExecuteSqlRaw(str);
            }
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
        public DbSet<StoryMobility> StoryMobilities { get; set; }
        public DbSet<ChairInfo> ChairInfos { get; set; }
        public DbSet<ChairOption> ChairOptions { get; set; }
        public DbSet<StoryComment> StoryComments { get; set; }
        public DbSet<Translation> Translations { get; set; }

        public DbSet<ChairStoryInfo> ChairStoryInfos { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Country>()
                .HasMany(x => x.states)
                .WithOne(x => x.country)
                .HasForeignKey(x => x.countryId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<User>()
                .HasMany(x => x.stories)
                .WithOne(x => x.user)
                .HasForeignKey(x => x.userId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<Story>()
                .HasMany(x => x.userComments)
                .WithOne(x => x.story)
                .HasForeignKey(x => x.storyId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<UserMobility>().HasIndex(x => x.userId);

        }
    }
}
