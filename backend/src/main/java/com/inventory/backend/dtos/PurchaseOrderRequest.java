package com.inventory.backend.dtos;

import lombok.Data;


@Data
public class PurchaseOrderRequest {
    private Long productId;
    private Long supplierId;
    private Integer quantity;
    private String notes;
}


