package com.controller;

import com.common.utils.StringStatic;
import com.model.Contact;
import com.response.MessageResponse;
import com.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/v1/contact")
public class ContactController {
    @Autowired
    private ContactService contactService;

    @PostMapping("/guest/save")
    public ResponseEntity<MessageResponse> save(@RequestBody Contact contact) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            contactService.save(contact);

            messageResponse.setMessage(StringStatic.SAVE);
        } catch(Exception e) {
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }

    @GetMapping("/find-all")
    public ResponseEntity<Page<Contact>> findAll(@RequestParam int page,
                                                 @RequestParam int size) {
        return ResponseEntity.ok().body(contactService.findAll(page, size));
    }

    @PutMapping("/update-status")
    public ResponseEntity<MessageResponse> save(@RequestParam String id) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            contactService.updatStatus(id);

            messageResponse.setMessage(StringStatic.SAVE);
        } catch(Exception e) {
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<MessageResponse> delete(@PathVariable String id) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            contactService.deleteById(id);

            messageResponse.setMessage(StringStatic.SUCCESS);
        } catch(Exception e) {
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }
}
