package com.example.praca_inzynierska.controller.api;

import com.example.praca_inzynierska.model.Product;
import com.example.praca_inzynierska.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAll() { return productService.getAllProducts(); }

    @PostMapping
    public Product create(@RequestBody Product product) { return productService.saveProduct(product); }
}