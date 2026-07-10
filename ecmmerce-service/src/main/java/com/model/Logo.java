package com.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Entity
@Table(name = "logo")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Logo {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageData;
    private Boolean isLogo;

    private String initBy;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate createDate;
}
