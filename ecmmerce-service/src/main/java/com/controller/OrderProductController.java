package com.controller;

import com.common.utils.StringStatic;
import com.dto.cart.CartProductOrderDTO;
import com.dto.orderproduct.OrderProductDTO;
import com.response.MessageResponse;
import com.service.OrderProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/v1/order-product")
public class OrderProductController {
    @Autowired
    private OrderProductService orderProductService;

    /** Tạo đơn hàng, sao chép dữ liệu giỏ hàng sang chi tiết đơn và xóa giỏ hàng sau khi lưu. */
    @PostMapping("/save")
    public ResponseEntity<MessageResponse> save(@RequestBody CartProductOrderDTO cartProductOrderDTO) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            orderProductService.save(cartProductOrderDTO);

            messageResponse.setMessage(StringStatic.SAVE);
        } catch (Exception e) {
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }

    /** Lấy danh sách đơn hàng có phân trang. */
    @GetMapping("/find-all")
    public ResponseEntity<Page<OrderProductDTO>> findAll(@RequestParam int page,
                                                         @RequestParam int size) {
        return ResponseEntity.ok().body(orderProductService.findAll(page, size));
    }

    /** Lấy danh sách đơn hàng của người dùng hiện tại có phân trang. */
    @GetMapping("/my-orders")
    public ResponseEntity<Page<OrderProductDTO>> findByUsername(@RequestParam int page,
                                                                @RequestParam int size) {
        return ResponseEntity.ok().body(orderProductService.findByUsername(page, size));
    }

    /** Tìm đơn hàng theo mã định danh. */
    @GetMapping("/order-detail/{id}")
    public ResponseEntity<OrderProductDTO> findById(@PathVariable String id) {
        return ResponseEntity.ok().body(orderProductService.findById(id));
    }

    /** Tìm đơn hàng theo người dùng hiện tại và mã định danh. */
    @GetMapping("/my-order-detail/{id}")
    public ResponseEntity<OrderProductDTO> findByUsernameAndId(@PathVariable String id) {
        return ResponseEntity.ok().body(orderProductService.findByUsernameAndId(id));
    }

    /** Xóa đơn hàng theo mã định danh. */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<MessageResponse> delete(@PathVariable String id) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            orderProductService.deleteById(id);

            messageResponse.setMessage(StringStatic.SUCCESS);
        } catch (Exception e) {
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }

    /** Chuyển đơn hàng sang trạng thái xử lý kế tiếp và lưu thay đổi. */
    @PutMapping("/update-status")
    public ResponseEntity<MessageResponse> updateStatus(@RequestParam String id,  @RequestParam int status) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            orderProductService.updateStatus(id, status);

            messageResponse.setMessage(StringStatic.SAVE);
        } catch (Exception e) {
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }

}
