using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(IUnitOfWork unit) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts(
        [FromQuery] ProductSpecParams specParams)
    {
        var spec = new ProductSpecification(specParams);

        return await CreatePagedResult(unit.Repository<Product>(), spec, specParams.PageIndex, specParams.PageSize);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await unit.Repository<Product>().GetByIdAsync(id);

        if (product == null) return NotFound();

        return product;
    }
    [Authorize(Roles ="Admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        unit.Repository<Product>().Add(product);

        if (await unit.Complete())
            return CreatedAtAction("GetProduct", new { id = product.Id }, product);

        return BadRequest("Failed to add product");
    }
    [Authorize(Roles ="Admin")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, Product product)
    {
        if (product.Id != id || !ProductExists(id))
            return BadRequest("Cannot update product because product does not exist");

        unit.Repository<Product>().Update(product);

        if (await unit.Complete())
            return NoContent();

        return BadRequest("Failed to update product");
    }

    [Authorize(Roles ="Admin")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await unit.Repository<Product>().GetByIdAsync(id);

        if (product == null) return NotFound();

        unit.Repository<Product>().Remove(product);

        if (await unit.Complete())
            return NoContent();

        return BadRequest("Failed to delete product");
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands()
    {
        var spec = new BrandListSpec();
        return Ok(await unit.Repository<Product>().ListAysnc(spec));
    }

    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
        var spec = new TypeListSpec();
        return Ok(await unit.Repository<Product>().ListAysnc(spec));
    }
    
    [HttpGet("platforms")]
    public ActionResult<IReadOnlyList<string>> GetPlatforms()
    {
        var platforms = Enum.GetNames(typeof(Platform)).ToList();
        return Ok(platforms);
    }
    
    private bool ProductExists(int id)
    {
        return unit.Repository<Product>().Exists(id);
    }
}