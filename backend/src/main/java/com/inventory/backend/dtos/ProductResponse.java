package com.inventory.backend.dtos;

import lombok.Data;


@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private String unit;
    private Integer quantityInStock;
    private Integer minimumThreshold;
    private boolean lowStock;
}


