package com.example.praca_inzynierska.controller.api;

import com.example.praca_inzynierska.model.Material;
import com.example.praca_inzynierska.service.MaterialService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = "*") // Pozwala na dostęp z frontendu
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @GetMapping
    public List<Material> getAll() {
        return materialService.getAllMaterials();
    }

    @GetMapping("/{id}")
    public Material getOne(@PathVariable Long id) {
        return materialService.getMaterialById(id);
    }
}