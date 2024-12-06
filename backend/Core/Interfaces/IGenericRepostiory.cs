using System;
using Core.Entities;

namespace Core.Interfaces;

public interface IGenericRepository<T> where T: BaseEntity
{
    Task<T?> GetByIdAsync(int id);
    Task<IReadOnlyList<T>> ListAllAsync();
    Task<T?> GetEntityWithSpec(ISpecification<T> spec);

    Task<IReadOnlyList<T>> ListAysnc(ISpecification<T> spec);

    // projection
    Task<TResult?> GetEntityWithSpec<TResult>(ISpecification<T, TResult> spec);
     // projection
    Task<IReadOnlyList<TResult>> ListAysnc<TResult>(ISpecification<T,TResult> spec);
    void Add(T entity);
    void Update(T entity);
    void Remove(T entity);

    Task<bool> SaveAllAsync();

    bool Exists(int id);
}
