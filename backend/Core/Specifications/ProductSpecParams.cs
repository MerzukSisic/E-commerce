using Core.Entities;

namespace Core.Specifications;

public class ProductSpecParams:PagingParams
{
   
    private List<string> _brands = [];
    public List<string> Brands
    {
        get => _brands;
        set
        {
            _brands = value.SelectMany(x=>x.Split(',',
                StringSplitOptions.RemoveEmptyEntries)).ToList();
        }
    }

    private List<string> _types = [];
    public List<string> Types
    {
        get => _types;
        set
        {
            _types = value.SelectMany(x=>x.Split(',',
                StringSplitOptions.RemoveEmptyEntries)).ToList();
        }
    }
    public string? Sort { get; set; }

    private string? _search { get; set; }
    public string Search
    {
        get => _search ?? "";
        set => _search = value.ToLower();
    }
    
    public decimal? minPrice {get; set;}
    public decimal? maxPrice {get; set;}
    
    public Platform? Platform { get; set; } 
}