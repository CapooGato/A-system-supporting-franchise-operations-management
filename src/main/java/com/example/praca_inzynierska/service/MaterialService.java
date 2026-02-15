package com.example.praca_inzynierska.service;

import com.example.praca_inzynierska.model.Material;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MaterialService {
    List<Material> getAllMaterials();
    Material getMaterialById(Long id);
    Material saveMaterial(Material material);
}