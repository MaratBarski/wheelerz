﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Wheelerz;

#nullable disable

namespace Wheelerz.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Wheelerz.Models.Accessibility", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<string>("comments")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("comments");

                    b.Property<string>("key")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("key");

                    b.Property<string>("name")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("name");

                    b.Property<int>("storyId")
                        .HasColumnType("int")
                        .HasColumnName("storyId");

                    b.Property<int>("userId")
                        .HasColumnType("int")
                        .HasColumnName("userId");

                    b.HasKey("id");

                    b.HasIndex("storyId");

                    b.ToTable("Accessibilities");
                });

            modelBuilder.Entity("Wheelerz.Models.AccessibilityFile", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<int>("accessibilityId")
                        .HasColumnType("int")
                        .HasColumnName("accessibilityId");

                    b.Property<string>("fileName")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("fileName");

                    b.Property<string>("small")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("small");

                    b.Property<int>("userId")
                        .HasColumnType("int")
                        .HasColumnName("userId");

                    b.HasKey("id");

                    b.HasIndex("accessibilityId");

                    b.ToTable("AccessibilityFiles");
                });

            modelBuilder.Entity("Wheelerz.Models.AccessibilityItem", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<int>("accessibilityId")
                        .HasColumnType("int")
                        .HasColumnName("accessibilityId");

                    b.Property<string>("key")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("key");

                    b.Property<string>("name")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("name");

                    b.Property<string>("selectedKey")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("selectedKey");

                    b.Property<string>("selectedValue")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("selectedValue");

                    b.Property<int>("userId")
                        .HasColumnType("int")
                        .HasColumnName("userId");

                    b.HasKey("id");

                    b.HasIndex("accessibilityId");

                    b.ToTable("AccessibilityItems");
                });

            modelBuilder.Entity("Wheelerz.Models.ChairInfo", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<double>("length")
                        .HasColumnType("float")
                        .HasColumnName("length");

                    b.Property<string>("messure")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("messure");

                    b.Property<double>("seatHeight")
                        .HasColumnType("float")
                        .HasColumnName("seatHeight");

                    b.Property<int>("userId")
                        .HasColumnType("int")
                        .HasColumnName("userId");

                    b.Property<double>("width")
                        .HasColumnType("float")
                        .HasColumnName("width");

                    b.HasKey("id");

                    b.HasIndex("userId")
                        .IsUnique();

                    b.ToTable("ChairInfos");
                });

            modelBuilder.Entity("Wheelerz.Models.ChairOption", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<string>("key")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("key");

                    b.Property<int>("userId")
                        .HasColumnType("int")
                        .HasColumnName("userId");

                    b.Property<string>("value")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("value");

                    b.HasKey("id");

                    b.HasIndex("userId");

                    b.ToTable("ChairOptions");
                });

            modelBuilder.Entity("Wheelerz.Models.ChairStoryInfo", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<double>("length")
                        .HasColumnType("float")
                        .HasColumnName("length");

                    b.Property<string>("messure")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("messure");

                    b.Property<double>("seatHeight")
                        .HasColumnType("float")
                        .HasColumnName("seatHeight");

                    b.Property<int>("storyId")
                        .HasColumnType("int")
                        .HasColumnName("storyId");

                    b.Property<double>("width")
                        .HasColumnType("float")
                        .HasColumnName("width");

                    b.HasKey("id");

                    b.HasIndex("storyId")
                        .IsUnique();

                    b.ToTable("ChairStoryInfos");
                });

            modelBuilder.Entity("Wheelerz.Models.Country", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<int>("deleted")
                        .HasColumnType("int")
                        .HasColumnName("deleted");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("name");

                    b.HasKey("id");

                    b.ToTable("Countries");
                });

            modelBuilder.Entity("Wheelerz.Models.State", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<int>("countryId")
                        .HasColumnType("int")
                        .HasColumnName("countryId");

                    b.Property<int>("deleted")
                        .HasColumnType("int")
                        .HasColumnName("deleted");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("name");

                    b.HasKey("id");

                    b.HasIndex("countryId");

                    b.ToTable("States");
                });

            modelBuilder.Entity("Wheelerz.Models.Story", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<string>("address")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("address");

                    b.Property<int>("approved")
                        .HasColumnType("int")
                        .HasColumnName("approved");

                    b.Property<int>("chairNumber")
                        .HasColumnType("int")
                        .HasColumnName("chairNumber");

                    b.Property<int>("cityId")
                        .HasColumnType("int")
                        .HasColumnName("cityId");

                    b.Property<string>("comments")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("comments");

                    b.Property<int>("countryId")
                        .HasColumnType("int")
                        .HasColumnName("countryId");

                    b.Property<DateTime>("dateAdd")
                        .HasColumnType("datetime2")
                        .HasColumnName("dateAdd");

                    b.Property<int>("deleted")
                        .HasColumnType("int")
                        .HasColumnName("deleted");

                    b.Property<DateTime>("endDate")
                        .HasColumnType("datetime2")
                        .HasColumnName("endDate");

                    b.Property<int>("estimation")
                        .HasColumnType("int")
                        .HasColumnName("estimation");

                    b.Property<string>("gmap")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("gmap");

                    b.Property<double>("height")
                        .HasColumnType("float")
                        .HasColumnName("height");

                    b.Property<string>("key")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("key");

                    b.Property<string>("lang")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("lang");

                    b.Property<double>("length")
                        .HasColumnType("float")
                        .HasColumnName("length");

                    b.Property<string>("link")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("link");

                    b.Property<string>("mail")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("mail");

                    b.Property<string>("mainImage")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("mainImage");

                    b.Property<string>("map")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("map");

                    b.Property<int>("mobilityNumber")
                        .HasColumnType("int")
                        .HasColumnName("mobilityNumber");

                    b.Property<string>("name")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("name");

                    b.Property<string>("phone")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("phone");

                    b.Property<DateTime>("startDate")
                        .HasColumnType("datetime2")
                        .HasColumnName("startDate");

                    b.Property<int>("storyType")
                        .HasColumnType("int")
                        .HasColumnName("storyType");

                    b.Property<string>("title")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("title");

                    b.Property<int>("userId")
                        .HasColumnType("int")
                        .HasColumnName("userId");

                    b.Property<double>("width")
                        .HasColumnType("float")
                        .HasColumnName("width");

                    b.HasKey("id");

                    b.HasIndex("cityId");

                    b.HasIndex("countryId");

                    b.HasIndex("userId");

                    b.ToTable("Stories");
                });

            modelBuilder.Entity("Wheelerz.Models.StoryComment", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<DateTime>("dateAdd")
                        .HasColumnType("datetime2")
                        .HasColumnName("dateAdd");

                    b.Property<int>("deleted")
                        .HasColumnType("int")
                        .HasColumnName("deleted");

                    b.Property<int>("storyId")
                        .HasColumnType("int")
                        .HasColumnName("storyId");

                    b.Property<string>("text")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("text");

                    b.Property<int>("userId")
                        .HasColumnType("int")
                        .HasColumnName("userId");

                    b.HasKey("id");

                    b.HasIndex("storyId");

                    b.HasIndex("userId");

                    b.ToTable("StoryComments");
                });

            modelBuilder.Entity("Wheelerz.Models.StoryMobility", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("name");

                    b.Property<int>("storyId")
                        .HasColumnType("int")
                        .HasColumnName("storyId");

                    b.HasKey("id");

                    b.HasIndex("storyId");

                    b.ToTable("StoryMobilities");
                });

            modelBuilder.Entity("Wheelerz.Models.StoryPhoto", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<string>("fileName")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("fileName");

                    b.Property<string>("small")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("small");

                    b.Property<int>("storyId")
                        .HasColumnType("int")
                        .HasColumnName("storyId");

                    b.HasKey("id");

                    b.HasIndex("storyId");

                    b.ToTable("StoryPhotos");
                });

            modelBuilder.Entity("Wheelerz.Models.Translation", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<string>("key")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("key");

                    b.Property<string>("lang")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("lang");

                    b.Property<string>("text")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("text");

                    b.HasKey("id");

                    b.ToTable("Translations");
                });

            modelBuilder.Entity("Wheelerz.Models.User", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<string>("avatar")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("avatar");

                    b.Property<DateTime>("birthDay")
                        .HasColumnType("datetime2")
                        .HasColumnName("birthDay");

                    b.Property<int>("birthYear")
                        .HasColumnType("int")
                        .HasColumnName("birthYear");

                    b.Property<int>("chairNumber")
                        .HasColumnType("int")
                        .HasColumnName("chairNumber");

                    b.Property<int>("countryId")
                        .HasColumnType("int")
                        .HasColumnName("countryId");

                    b.Property<int>("deleted")
                        .HasColumnType("int")
                        .HasColumnName("deleted");

                    b.Property<string>("email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("email");

                    b.Property<string>("firstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("firstName");

                    b.Property<string>("key")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("key");

                    b.Property<string>("lastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("lastName");

                    b.Property<DateTime>("lastVisit")
                        .HasColumnType("datetime2")
                        .HasColumnName("lastVisit");

                    b.Property<int>("mobilityNumber")
                        .HasColumnType("int")
                        .HasColumnName("mobilityNumber");

                    b.Property<int>("noWalk")
                        .HasColumnType("int")
                        .HasColumnName("noWalk");

                    b.Property<string>("password")
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("password");

                    b.Property<int>("permission")
                        .HasColumnType("int")
                        .HasColumnName("permission");

                    b.Property<string>("phone")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("phone");

                    b.Property<DateTime>("registrDate")
                        .HasColumnType("datetime2")
                        .HasColumnName("registrDate");

                    b.Property<int>("role")
                        .HasColumnType("int")
                        .HasColumnName("role");

                    b.Property<int>("sex")
                        .HasColumnType("int")
                        .HasColumnName("sex");

                    b.Property<int>("stateId")
                        .HasColumnType("int")
                        .HasColumnName("stateId");

                    b.HasKey("id");

                    b.HasIndex("countryId");

                    b.HasIndex("stateId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Wheelerz.Models.UserMobility", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("id");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasColumnName("name");

                    b.Property<int>("userId")
                        .HasColumnType("int")
                        .HasColumnName("userId");

                    b.HasKey("id");

                    b.HasIndex("userId");

                    b.ToTable("UserMobilities");
                });

            modelBuilder.Entity("Wheelerz.Models.Accessibility", b =>
                {
                    b.HasOne("Wheelerz.Models.Story", null)
                        .WithMany("accessibility")
                        .HasForeignKey("storyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Wheelerz.Models.AccessibilityFile", b =>
                {
                    b.HasOne("Wheelerz.Models.Accessibility", null)
                        .WithMany("files")
                        .HasForeignKey("accessibilityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Wheelerz.Models.AccessibilityItem", b =>
                {
                    b.HasOne("Wheelerz.Models.Accessibility", null)
                        .WithMany("accessibilityItems")
                        .HasForeignKey("accessibilityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Wheelerz.Models.ChairInfo", b =>
                {
                    b.HasOne("Wheelerz.Models.User", null)
                        .WithOne("chairInfo")
                        .HasForeignKey("Wheelerz.Models.ChairInfo", "userId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Wheelerz.Models.ChairOption", b =>
                {
                    b.HasOne("Wheelerz.Models.User", null)
                        .WithMany("chairOptions")
                        .HasForeignKey("userId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Wheelerz.Models.ChairStoryInfo", b =>
                {
                    b.HasOne("Wheelerz.Models.Story", null)
                        .WithOne("chairInfo")
                        .HasForeignKey("Wheelerz.Models.ChairStoryInfo", "storyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Wheelerz.Models.State", b =>
                {
                    b.HasOne("Wheelerz.Models.Country", "country")
                        .WithMany("states")
                        .HasForeignKey("countryId")
                        .IsRequired();

                    b.Navigation("country");
                });

            modelBuilder.Entity("Wheelerz.Models.Story", b =>
                {
                    b.HasOne("Wheelerz.Models.State", "city")
                        .WithMany()
                        .HasForeignKey("cityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Wheelerz.Models.Country", "country")
                        .WithMany()
                        .HasForeignKey("countryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Wheelerz.Models.User", "user")
                        .WithMany("stories")
                        .HasForeignKey("userId")
                        .IsRequired();

                    b.Navigation("city");

                    b.Navigation("country");

                    b.Navigation("user");
                });

            modelBuilder.Entity("Wheelerz.Models.StoryComment", b =>
                {
                    b.HasOne("Wheelerz.Models.Story", "story")
                        .WithMany("userComments")
                        .HasForeignKey("storyId")
                        .IsRequired();

                    b.HasOne("Wheelerz.Models.User", "user")
                        .WithMany()
                        .HasForeignKey("userId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("story");

                    b.Navigation("user");
                });

            modelBuilder.Entity("Wheelerz.Models.StoryMobility", b =>
                {
                    b.HasOne("Wheelerz.Models.Story", null)
                        .WithMany("mobilities")
                        .HasForeignKey("storyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Wheelerz.Models.StoryPhoto", b =>
                {
                    b.HasOne("Wheelerz.Models.Story", null)
                        .WithMany("storyPhotos")
                        .HasForeignKey("storyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Wheelerz.Models.User", b =>
                {
                    b.HasOne("Wheelerz.Models.Country", "country")
                        .WithMany()
                        .HasForeignKey("countryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Wheelerz.Models.State", "state")
                        .WithMany()
                        .HasForeignKey("stateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("country");

                    b.Navigation("state");
                });

            modelBuilder.Entity("Wheelerz.Models.UserMobility", b =>
                {
                    b.HasOne("Wheelerz.Models.User", null)
                        .WithMany("mobilities")
                        .HasForeignKey("userId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Wheelerz.Models.Accessibility", b =>
                {
                    b.Navigation("accessibilityItems");

                    b.Navigation("files");
                });

            modelBuilder.Entity("Wheelerz.Models.Country", b =>
                {
                    b.Navigation("states");
                });

            modelBuilder.Entity("Wheelerz.Models.Story", b =>
                {
                    b.Navigation("accessibility");

                    b.Navigation("chairInfo");

                    b.Navigation("mobilities");

                    b.Navigation("storyPhotos");

                    b.Navigation("userComments");
                });

            modelBuilder.Entity("Wheelerz.Models.User", b =>
                {
                    b.Navigation("chairInfo");

                    b.Navigation("chairOptions");

                    b.Navigation("mobilities");

                    b.Navigation("stories");
                });
#pragma warning restore 612, 618
        }
    }
}
