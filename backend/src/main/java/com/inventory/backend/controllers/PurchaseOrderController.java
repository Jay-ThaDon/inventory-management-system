package com.inventory.backend.controllers;

import com.inventory.backend.dtos.PurchaseOrderRequest;
import com.inventory.backend.dtos.PurchaseOrderResponse;
import com.inventory.backend.services.PurchaseOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @PostMapping
    @PreAuthorize("hasRole('PROCUREMENT_OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<PurchaseOrderResponse> createOrder(
            @RequestBody PurchaseOrderRequest request,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(purchaseOrderService.createOrder(request, email));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('WAREHOUSE_MANAGER')")
    public ResponseEntity<List<PurchaseOrderResponse>> getAllOrders() {
        return ResponseEntity.ok(purchaseOrderService.getAllOrders());
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('PROCUREMENT_OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<List<PurchaseOrderResponse>> getMyOrders(
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(purchaseOrderService.getMyOrders(email));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('WAREHOUSE_MANAGER')")
    public ResponseEntity<PurchaseOrderResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(purchaseOrderService.updateStatus(id, status));
    }
}


