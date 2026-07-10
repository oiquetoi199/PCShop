package com.service.impl;

import com.model.Contact;
import com.repository.ContactRepository;
import com.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ContactServiceImpl implements ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Override
    public void save(Contact contact) {
        contact.setCreateDate(LocalDate.now());
        contact.setStatus("N");
        contactRepository.save(contact);
    }

    @Override
    public Page<Contact> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return contactRepository.findAll(pageable);
    }

    @Override
    public void updatStatus(String id) {
        Optional<Contact> contactOptional = contactRepository.findById(id);

        if (contactOptional.isPresent()) {
            Contact contact = contactOptional.get();
            contact.setStatus("Y");
            contact.setUpdateDate(LocalDate.now());
            contactRepository.save(contact);
        }
    }

    @Override
    public void deleteById(String id) {
        contactRepository.deleteById(id);
    }
}
