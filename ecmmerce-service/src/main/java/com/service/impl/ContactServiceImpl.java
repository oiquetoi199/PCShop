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

    /** Kiểm tra và lưu thông tin liên hệ vào cơ sở dữ liệu. */
    @Override
    public void save(Contact contact) {
        contact.setCreateDate(LocalDate.now());
        contact.setStatus("N");
        contactRepository.save(contact);
    }

    /** Lấy danh sách thông tin liên hệ có phân trang. */
    @Override
    public Page<Contact> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return contactRepository.findAll(pageable);
    }

    /** Chuyển đơn hàng sang trạng thái xử lý kế tiếp và lưu thay đổi. */
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

    /** Xóa thông tin liên hệ theo mã định danh. */
    @Override
    public void deleteById(String id) {
        contactRepository.deleteById(id);
    }
}
