using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Services;

public class CouponService : ICouponService
{
    public async Task<AppCoupon?> GetCouponFromPromoCode(string code)
    {
        throw new NotImplementedException();
    }
}