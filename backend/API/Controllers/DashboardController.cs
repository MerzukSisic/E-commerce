using API.DTOs;
using API.Extensions;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class DashboardController(IUnitOfWork unit) : BaseApiController
{
    [Authorize]
    [HttpGet("user-dashboard")]
    public async Task<ActionResult<UserDashboardDto>> GetUserDashboard()
    {
        var email = User.GetEmail();

        // Dohvati sve narudžbe korisnika
        var spec = new OrderSpecification(email);
        var orders = await unit.Repository<Order>().ListAysnc(spec);

        if (orders == null || !orders.Any())
            return Ok(new UserDashboardDto { TotalOrders = 0, TotalSpent = 0, TotalGamesBought = 0 });

    
        var totalOrders = orders.Count;
        var totalSpent = orders.Sum(o => o.GetTotal());

     
        var totalGamesBought = orders
            .SelectMany(o => o.OrderItems)
            .Sum(i => i.Quantity);


        var platformSales = orders
            .SelectMany(o => o.OrderItems)
            .GroupBy(i => 
            {
                var product = unit.Repository<Product>().GetByIdAsync(i.ItemOrdered.ProductId).Result;
                return product?.PlatformType.ToString() ?? "Other";
            })
            .Select(g => new PlatformSalesDto
            {
                Platform = g.Key,
                SalesCount = g.Sum(i => i.Quantity) 
            }).ToList();

        var dashboardDto = new UserDashboardDto
        {
            TotalOrders = totalOrders,
            TotalSpent = totalSpent,
            TotalGamesBought = totalGamesBought, 
            PlatformSales = platformSales
        };
        return Ok(dashboardDto);
    }
}