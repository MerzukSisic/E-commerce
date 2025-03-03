using Core.Entities;

namespace Core.Specifications;

public class ProductSpecification : BaseSpecification<Product>
{
    public ProductSpecification(ProductSpecParams specParams) : base(x =>
        (string.IsNullOrEmpty(specParams.Search) || x.Name.ToLower().Contains(specParams.Search)) &&
        (specParams.Brands.Count == 0 || specParams.Brands.Contains(x.Brand)) &&
        (specParams.Types.Count == 0 || specParams.Types.Contains(x.Type)) &&
        (!specParams.minPrice.HasValue || x.Price >= specParams.minPrice.Value) &&
        (!specParams.maxPrice.HasValue || x.Price <= specParams.maxPrice.Value) &&
        (!specParams.Platform.HasValue || x.PlatformType == specParams.Platform))
    {
        ApplyPaging(specParams.PageSize * (specParams.PageIndex - 1),
            specParams.PageSize);

        switch (specParams.Sort)
        {
            case "priceAsc":
                AddOrderBy(x => x.Price);
                break;

            case "priceDesc":
                AddOrderByDescending(x => x.Price);
                break;

            default:
                AddOrderBy(x => x.Name);
                break;
        }
    }
}