using System.Text.Json;
using Core.Interfaces;
using StackExchange.Redis;

namespace Infrastructure.Services;

public class ResponseCacheService(IConnectionMultiplexer redis) : IResponseCacheService
{
    private readonly IDatabase _database = redis.GetDatabase(1);

    public async Task CacheResponseAsync(string cacheKey, object response, TimeSpan timeToLive)
    {
        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var serializedResponse = JsonSerializer.Serialize(response, options);
        var success = await _database.StringSetAsync(cacheKey, serializedResponse, timeToLive);

        if (!success)
        {
            Console.WriteLine($"[Cache] FAILED to store key: {cacheKey}");
        }
        else
        {
            Console.WriteLine($"[Cache] STORED key: {cacheKey} for {timeToLive.TotalSeconds} seconds.");
        }
    }

    public async Task<string?> GetCachedResponseAsync(string cacheKey)
    {
        var cachedResponse = await _database.StringGetAsync(cacheKey);
        if (cachedResponse.IsNullOrEmpty)
        {
            Console.WriteLine($"[Cache] MISS for key: {cacheKey}");
            return null;
        }

        Console.WriteLine($"[Cache] HIT for key: {cacheKey}");
        return cachedResponse;
    }

    public async Task RemoveCacheByPattern(string pattern)
    {
        throw new NotImplementedException();
    }
}