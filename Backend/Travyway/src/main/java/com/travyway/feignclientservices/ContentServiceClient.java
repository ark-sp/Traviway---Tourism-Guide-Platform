package com.travyway.feignclientservices;

import com.travyway.entities.dto.PlaceDetailDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ContentService")
public interface ContentServiceClient {

    @GetMapping("/api/content/places/{id}")
    PlaceDetailDTO getPlaceById(@PathVariable("id") Integer id);
}
