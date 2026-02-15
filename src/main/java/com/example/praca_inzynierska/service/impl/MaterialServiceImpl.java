package com.example.praca_inzynierska.service.impl;

import com.example.praca_inzynierska.model.Material;
import com.example.praca_inzynierska.repository.MaterialRepository;
import com.example.praca_inzynierska.service.MaterialService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;

    public MaterialServiceImpl(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    @Override
    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }

    @Override
    public Material getMaterialById(Long id) {
        return materialRepository.findById(id).orElse(null);
    }

    @Override
    public Material saveMaterial(Material material) {
        return materialRepository.save(material);
    }
}