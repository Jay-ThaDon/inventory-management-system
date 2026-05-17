package com.inventory.backend.dtos;

import lombok.Data;


@Data
public class PurchaseOrderResponse {
    private Long id;
    private String productName;
    private String supplierName;
    private String raisedByName;
    private Integer quantity;
    private String status;
    private String notes;
    private String createdAt;
}

