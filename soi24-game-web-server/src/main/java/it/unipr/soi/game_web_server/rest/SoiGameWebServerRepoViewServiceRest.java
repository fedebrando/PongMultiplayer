package it.unipr.soi.game_web_server.rest;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.unipr.soi.game_web_server.service.SoiGameWebServerRepoViewService;

@RestController
@RequestMapping("/admin/repo")
public class SoiGameWebServerRepoViewServiceRest {

    private final SoiGameWebServerRepoViewService service;

    public SoiGameWebServerRepoViewServiceRest(SoiGameWebServerRepoViewService service) {
        this.service = service;
    }

    @GetMapping("/map")
    public Map<String, Object> getRepoMap() {
        return service.getRepoMap();
    }
}
