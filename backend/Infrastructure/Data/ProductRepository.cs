using Core.Entities;
using Core.Entities.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class ProductRepository(StoreContext context) : IProductRepository
{
    public async Task<IReadOnlyList<Product>> GetProductsAsync(string? brand, string? type,string? sort)
    {
        var query=context.Products.AsQueryable();
        if(!string.IsNullOrWhiteSpace(brand))
            query = query.Where(p => p.Brand == brand);
        if(!string.IsNullOrWhiteSpace(type))
            query = query.Where(p => p.Type == type);

        query = sort switch
        {
            "priceAsc" => query.OrderBy(p => p.Price),
            "priceDesc" => query.OrderByDescending(p => p.Price),
            _ => query.OrderBy(p => p.Name)
        };
        return await query.ToListAsync();
    }

    public async Task<Product?> GetProductByIdAsync(int productId)
    {
        return await context.Products.FindAsync(productId);
    }

    public async Task<IReadOnlyList<string>> GetBrandsAsync()
    {
        return await context.Products.Select(x => x.Brand)
            .Distinct()
            .ToListAsync();
    }

    public async Task<IReadOnlyList<string>> GetTypesAsync()
    {
        return await context.Products.Select(x => x.Type)
            .Distinct()
            .ToListAsync();
    }

    public void AddProduct(Product product)
    {
        context.Add(product);
    }
    public void UpdateProduct(Product product)
    {
        context.Entry(product).State = EntityState.Modified;
    }

    public void DeleteProduct(Product product)
    {
        context.Remove(product);
    }

    public bool ProductExists(int productId)
    {
        return context.Products.Any(x => x.Id == productId);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}