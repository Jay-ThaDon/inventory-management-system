package com.inventory.backend.repositories;

import com.inventory.backend.models.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findByRaisedById(Long userId);
    List<PurchaseOrder> findByStatus(PurchaseOrder.Status status);
}

