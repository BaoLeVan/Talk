package com.talktalk.service;

public interface CrudService<T, ID> {
    T save(T entity);

    T update(T entity);

    void delete(ID id);

    T getById(ID id);
}
