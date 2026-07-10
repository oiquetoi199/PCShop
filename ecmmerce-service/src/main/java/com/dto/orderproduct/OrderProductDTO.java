package com.dto.orderproduct;

import com.model.OrderProduct;
import com.model.OrderProductItem;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderProductDTO {
    private OrderProduct orderProduct;
    private List<OrderProductItem> orderProductItemList;
}
