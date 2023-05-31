using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wheelerz.Migrations
{
    /// <inheritdoc />
    public partial class create : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Countries",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    deleted = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Countries", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Translations",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    key = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    lang = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    text = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Translations", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "States",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    countryId = table.Column<int>(type: "int", nullable: false),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    deleted = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_States", x => x.id);
                    table.ForeignKey(
                        name: "FK_States_Countries_countryId",
                        column: x => x.countryId,
                        principalTable: "Countries",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    role = table.Column<int>(type: "int", nullable: false),
                    permission = table.Column<int>(type: "int", nullable: false),
                    countryId = table.Column<int>(type: "int", nullable: false),
                    stateId = table.Column<int>(type: "int", nullable: false),
                    sex = table.Column<int>(type: "int", nullable: false),
                    firstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    lastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    deleted = table.Column<int>(type: "int", nullable: false),
                    noWalk = table.Column<int>(type: "int", nullable: false),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    key = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    birthDay = table.Column<DateTime>(type: "datetime2", nullable: false),
                    lastVisit = table.Column<DateTime>(type: "datetime2", nullable: false),
                    birthYear = table.Column<int>(type: "int", nullable: false),
                    registrDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    avatar = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    mobilityNumber = table.Column<int>(type: "int", nullable: false),
                    chairNumber = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.id);
                    table.ForeignKey(
                        name: "FK_Users_Countries_countryId",
                        column: x => x.countryId,
                        principalTable: "Countries",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Users_States_stateId",
                        column: x => x.stateId,
                        principalTable: "States",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChairInfos",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userId = table.Column<int>(type: "int", nullable: false),
                    width = table.Column<double>(type: "float", nullable: false),
                    length = table.Column<double>(type: "float", nullable: false),
                    seatHeight = table.Column<double>(type: "float", nullable: false),
                    messure = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChairInfos", x => x.id);
                    table.ForeignKey(
                        name: "FK_ChairInfos_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChairOptions",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userId = table.Column<int>(type: "int", nullable: false),
                    key = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChairOptions", x => x.id);
                    table.ForeignKey(
                        name: "FK_ChairOptions_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Stories",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userId = table.Column<int>(type: "int", nullable: false),
                    approved = table.Column<int>(type: "int", nullable: false),
                    key = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    countryId = table.Column<int>(type: "int", nullable: false),
                    cityId = table.Column<int>(type: "int", nullable: false),
                    width = table.Column<double>(type: "float", nullable: false),
                    length = table.Column<double>(type: "float", nullable: false),
                    height = table.Column<double>(type: "float", nullable: false),
                    title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    estimation = table.Column<int>(type: "int", nullable: false),
                    comments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    lang = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    storyType = table.Column<int>(type: "int", nullable: false),
                    startDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    endDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    dateAdd = table.Column<DateTime>(type: "datetime2", nullable: false),
                    deleted = table.Column<int>(type: "int", nullable: false),
                    phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    map = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    mail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    link = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    mainImage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    gmap = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    mobilityNumber = table.Column<int>(type: "int", nullable: false),
                    chairNumber = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stories", x => x.id);
                    table.ForeignKey(
                        name: "FK_Stories_Countries_countryId",
                        column: x => x.countryId,
                        principalTable: "Countries",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Stories_States_cityId",
                        column: x => x.cityId,
                        principalTable: "States",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Stories_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "UserMobilities",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userId = table.Column<int>(type: "int", nullable: false),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserMobilities", x => x.id);
                    table.ForeignKey(
                        name: "FK_UserMobilities_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Accessibilities",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userId = table.Column<int>(type: "int", nullable: false),
                    storyId = table.Column<int>(type: "int", nullable: false),
                    key = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    comments = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accessibilities", x => x.id);
                    table.ForeignKey(
                        name: "FK_Accessibilities_Stories_storyId",
                        column: x => x.storyId,
                        principalTable: "Stories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChairStoryInfos",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    storyId = table.Column<int>(type: "int", nullable: false),
                    width = table.Column<double>(type: "float", nullable: false),
                    length = table.Column<double>(type: "float", nullable: false),
                    seatHeight = table.Column<double>(type: "float", nullable: false),
                    messure = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChairStoryInfos", x => x.id);
                    table.ForeignKey(
                        name: "FK_ChairStoryInfos_Stories_storyId",
                        column: x => x.storyId,
                        principalTable: "Stories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StoryComments",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    storyId = table.Column<int>(type: "int", nullable: false),
                    userId = table.Column<int>(type: "int", nullable: false),
                    dateAdd = table.Column<DateTime>(type: "datetime2", nullable: false),
                    deleted = table.Column<int>(type: "int", nullable: false),
                    text = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StoryComments", x => x.id);
                    table.ForeignKey(
                        name: "FK_StoryComments_Stories_storyId",
                        column: x => x.storyId,
                        principalTable: "Stories",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_StoryComments_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StoryMobilities",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    storyId = table.Column<int>(type: "int", nullable: false),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StoryMobilities", x => x.id);
                    table.ForeignKey(
                        name: "FK_StoryMobilities_Stories_storyId",
                        column: x => x.storyId,
                        principalTable: "Stories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StoryPhotos",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    storyId = table.Column<int>(type: "int", nullable: false),
                    small = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    fileName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StoryPhotos", x => x.id);
                    table.ForeignKey(
                        name: "FK_StoryPhotos_Stories_storyId",
                        column: x => x.storyId,
                        principalTable: "Stories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AccessibilityFiles",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userId = table.Column<int>(type: "int", nullable: false),
                    accessibilityId = table.Column<int>(type: "int", nullable: false),
                    fileName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    small = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccessibilityFiles", x => x.id);
                    table.ForeignKey(
                        name: "FK_AccessibilityFiles_Accessibilities_accessibilityId",
                        column: x => x.accessibilityId,
                        principalTable: "Accessibilities",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AccessibilityItems",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userId = table.Column<int>(type: "int", nullable: false),
                    accessibilityId = table.Column<int>(type: "int", nullable: false),
                    key = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    selectedKey = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    selectedValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccessibilityItems", x => x.id);
                    table.ForeignKey(
                        name: "FK_AccessibilityItems_Accessibilities_accessibilityId",
                        column: x => x.accessibilityId,
                        principalTable: "Accessibilities",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Accessibilities_storyId",
                table: "Accessibilities",
                column: "storyId");

            migrationBuilder.CreateIndex(
                name: "IX_AccessibilityFiles_accessibilityId",
                table: "AccessibilityFiles",
                column: "accessibilityId");

            migrationBuilder.CreateIndex(
                name: "IX_AccessibilityItems_accessibilityId",
                table: "AccessibilityItems",
                column: "accessibilityId");

            migrationBuilder.CreateIndex(
                name: "IX_ChairInfos_userId",
                table: "ChairInfos",
                column: "userId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChairOptions_userId",
                table: "ChairOptions",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_ChairStoryInfos_storyId",
                table: "ChairStoryInfos",
                column: "storyId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_States_countryId",
                table: "States",
                column: "countryId");

            migrationBuilder.CreateIndex(
                name: "IX_Stories_cityId",
                table: "Stories",
                column: "cityId");

            migrationBuilder.CreateIndex(
                name: "IX_Stories_countryId",
                table: "Stories",
                column: "countryId");

            migrationBuilder.CreateIndex(
                name: "IX_Stories_userId",
                table: "Stories",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_StoryComments_storyId",
                table: "StoryComments",
                column: "storyId");

            migrationBuilder.CreateIndex(
                name: "IX_StoryComments_userId",
                table: "StoryComments",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_StoryMobilities_storyId",
                table: "StoryMobilities",
                column: "storyId");

            migrationBuilder.CreateIndex(
                name: "IX_StoryPhotos_storyId",
                table: "StoryPhotos",
                column: "storyId");

            migrationBuilder.CreateIndex(
                name: "IX_UserMobilities_userId",
                table: "UserMobilities",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_countryId",
                table: "Users",
                column: "countryId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_stateId",
                table: "Users",
                column: "stateId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AccessibilityFiles");

            migrationBuilder.DropTable(
                name: "AccessibilityItems");

            migrationBuilder.DropTable(
                name: "ChairInfos");

            migrationBuilder.DropTable(
                name: "ChairOptions");

            migrationBuilder.DropTable(
                name: "ChairStoryInfos");

            migrationBuilder.DropTable(
                name: "StoryComments");

            migrationBuilder.DropTable(
                name: "StoryMobilities");

            migrationBuilder.DropTable(
                name: "StoryPhotos");

            migrationBuilder.DropTable(
                name: "Translations");

            migrationBuilder.DropTable(
                name: "UserMobilities");

            migrationBuilder.DropTable(
                name: "Accessibilities");

            migrationBuilder.DropTable(
                name: "Stories");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "States");

            migrationBuilder.DropTable(
                name: "Countries");
        }
    }
}
