package com.inventory.backend.dtos;

import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private String unit;
    private Integer quantityInStock;
    private Integer minimumThreshold;
}

