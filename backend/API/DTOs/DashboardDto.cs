namespace API.DTOs;

public class UserDashboardDto
{ 
    public int TotalOrders { get; set; } // Ukupan broj kupovina
    public decimal TotalSpent { get; set; } // Ukupna potrošnja korisnika
    public int TotalGamesBought { get; set; } // ✅ Ukupan broj kupljenih igrica
    public List<PlatformSalesDto> PlatformSales { get; set; } = new(); // ✅ Računa broj igrica po platformi
}

public class PlatformSalesDto
{
    public string Platform { get; set; } = string.Empty;
    public int SalesCount { get; set; }
}
