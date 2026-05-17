package com.inventory.backend.services;

import com.inventory.backend.dtos.ProductRequest;
import com.inventory.backend.dtos.ProductResponse;
import com.inventory.backend.models.Product;
import com.inventory.backend.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class ProductService {

    private final ProductRepository productRepository;

    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setUnit(request.getUnit());
        product.setQuantityInStock(request.getQuantityInStock());
        product.setMinimumThreshold(request.getMinimumThreshold());
        product.setCreatedAt(LocalDateTime.now());
        return mapToResponse(productRepository.save(product));
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToResponse(product);
    }


    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setUnit(request.getUnit());
        product.setQuantityInStock(request.getQuantityInStock());
        product.setMinimumThreshold(request.getMinimumThreshold());
        return mapToResponse(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.deleteById(id);
    }

    public List<ProductResponse> getLowStockProducts() {
        return productRepository.findAll()
                .stream()
                .filter(p -> p.getQuantityInStock() <= p.getMinimumThreshold())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setUnit(product.getUnit());
        response.setQuantityInStock(product.getQuantityInStock());
        response.setMinimumThreshold(product.getMinimumThreshold());
        response.setLowStock(
                product.getQuantityInStock() <= product.getMinimumThreshold()
        );
        return response;

    }
}


