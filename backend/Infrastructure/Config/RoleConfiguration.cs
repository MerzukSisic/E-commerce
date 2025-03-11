using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Config;

public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
{
    public void Configure(EntityTypeBuilder<IdentityRole> builder)
    {
        builder.HasData(
            new IdentityRole { Id = "d2b2f4a9-8a8b-4f3a-87c1-6b27f52e52b7", Name = "Admin", NormalizedName = "ADMIN" },
            new IdentityRole { Id = "a1c9e3e4-5d3b-49f8-9c31-4f8c7d0b2e5a", Name = "Customer", NormalizedName = "CUSTOMER" }
        );
    }
}