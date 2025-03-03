﻿using System.Text.Json.Serialization;

namespace Core.Entities;

public class Product : BaseEntity
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public decimal Price { get; set; }  
    public required string PictureUrl { get; set; } 
    public required string Type { get; set; }
    public required string Brand{ get; set; }
    public int QuantityInStock { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))] 
    public Platform PlatformType { get; set; }
}