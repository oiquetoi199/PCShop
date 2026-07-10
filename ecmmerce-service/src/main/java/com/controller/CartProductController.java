package com.controller;

import com.common.utils.StringStatic;
import com.dto.cart.CartProductDTO;
import com.model.CartProduct;
import com.response.MessageResponse;
import com.service.CartProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/cart-product")
public class CartProductController {
    @Autowired
    private CartProductService cartProductService;

    @PostMapping("/save")
    public ResponseEntity<MessageResponse> save(@RequestBody CartProduct cartProduct) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            cartProductService.save(cartProduct);
            messageResponse.setMessage(StringStatic.SAVE);
        } catch (Exception e) {
            e.printStackTrace();
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }

    @GetMapping("/cart-list")
    public ResponseEntity<CartProductDTO> getCartList() {
        return ResponseEntity.ok().body(cartProductService.findByUsername());
    }

    @PutMapping("/update")
    public ResponseEntity<MessageResponse> update(@RequestParam String id, @RequestParam int quantity) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            cartProductService.update(id,quantity);
            messageResponse.setMessage(StringStatic.SAVE);
        } catch (Exception e) {
            e.printStackTrace();
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<MessageResponse> delete(@PathVariable String id) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            cartProductService.delete(id);

            messageResponse.setMessage(StringStatic.SUCCESS);
        } catch(Exception e) {
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }
}
