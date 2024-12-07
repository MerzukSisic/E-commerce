using Core.Entities;
using Core.Entities.Interfaces;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(IGenericRepository<Product> repo) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
        [FromBody]ProductSpecParams specParams)
    {
        var spec=new ProductSpecification(specParams);
        var products=await repo.ListAysnc(spec);
        
        return  Ok(products);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await repo.GetByIdAsync(id);
        
        if (product == null) return NotFound();
        
        return product;    
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        repo.Add(product);
        
        if(await repo.SaveAllAsync())
            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        
        return BadRequest("Failed to add product");
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, Product product)
    {
        if (product.Id != id || !ProductExists(id)) 
            return BadRequest("Cannot update product because product does not exist");
        
        repo.Update(product);
        
        if(await repo.SaveAllAsync())
            return NoContent();
            
        return BadRequest("Failed to update product");
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await repo.GetByIdAsync(id);
        
        if(product == null) return NotFound();
        
        repo.Remove(product);
        
        if(await repo.SaveAllAsync())
            return NoContent();
            
        return BadRequest("Failed to delete product");
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetBrands()
    {

       var spec=new BrandListSpec();
       return Ok(await repo.ListAysnc(spec));
    }
    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetTypes()
    {
        var spec=new TypeListSpec();
       return Ok(await repo.ListAysnc(spec));
    }

    
    
    private bool ProductExists(int id)
    {
        return repo.Exists(id);
    }
    
}