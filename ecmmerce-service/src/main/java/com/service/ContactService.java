package com.service;

import com.model.Contact;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ContactService {
    void save(Contact contact);

    Page<Contact> findAll(int page, int size);

    void updatStatus(String id);

    void deleteById(String id);
}
