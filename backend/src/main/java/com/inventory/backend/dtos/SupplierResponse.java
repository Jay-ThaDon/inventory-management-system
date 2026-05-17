package com.inventory.backend.dtos;

import lombok.Data;

@Data
public class SupplierResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
}

