package com.example.praca_inzynierska.service;

import com.example.praca_inzynierska.model.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductService {
     List<Product> getAllProducts();
     Product saveProduct(Product product);
     void deleteProduct(Long id);
}
