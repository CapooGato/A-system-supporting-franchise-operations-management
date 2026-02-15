package com.example.praca_inzynierska.service.impl;

import com.example.praca_inzynierska.model.Product;
import com.example.praca_inzynierska.repository.ProductRepository;
import com.example.praca_inzynierska.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> getAllProducts() { return productRepository.findAll(); }

    @Override
    public Product saveProduct(Product product) { return productRepository.save(product); }

    @Override
    public void deleteProduct(Long id) { productRepository.deleteById(id); }
}
