package com.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DashboardDTO {
    private Long userTotal;
    private Long productTotal;
    private Long orderTotal;
    private Long categoryTotal;
//    private Long newsTotal;
    private Long logoTotal;
//    private Long policyTotal;
    private Integer slideTotal;
}
