package com.inventory.backend.services;

import com.inventory.backend.dtos.PurchaseOrderRequest;
import com.inventory.backend.dtos.PurchaseOrderResponse;
import com.inventory.backend.models.*;
import com.inventory.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor

public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;

    public PurchaseOrderResponse createOrder(PurchaseOrderRequest request, String email) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PurchaseOrder order = new PurchaseOrder();
        order.setProduct(product);
        order.setSupplier(supplier);
        order.setRaisedBy(user);
        order.setQuantity(request.getQuantity());
        order.setNotes(request.getNotes());
        order.setStatus(PurchaseOrder.Status.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        return mapToResponse(purchaseOrderRepository.save(order));
    }

    public List<PurchaseOrderResponse> getAllOrders() {
        return purchaseOrderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PurchaseOrderResponse> getMyOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return purchaseOrderRepository.findByRaisedById(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PurchaseOrderResponse updateStatus(Long id, String status) {
        PurchaseOrder order = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(PurchaseOrder.Status.valueOf(status));

        if (PurchaseOrder.Status.valueOf(status) == PurchaseOrder.Status.DELIVERED) {
            Product product = order.getProduct();
            product.setQuantityInStock(
                    product.getQuantityInStock() + order.getQuantity()
            );
            productRepository.save(product);
        }

        return mapToResponse(purchaseOrderRepository.save(order));
    }

    private PurchaseOrderResponse mapToResponse(PurchaseOrder order) {
        PurchaseOrderResponse response = new PurchaseOrderResponse();
        response.setId(order.getId());
        response.setProductName(order.getProduct().getName());
        response.setSupplierName(order.getSupplier().getName());
        response.setRaisedByName(order.getRaisedBy().getName());
        response.setQuantity(order.getQuantity());
        response.setStatus(order.getStatus().name());
        response.setNotes(order.getNotes());
        response.setCreatedAt(order.getCreatedAt().toString());
        return response;
    }
}

