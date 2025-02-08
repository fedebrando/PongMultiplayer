package it.unipr.soi.game_web_server.rest;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.unipr.soi.game_web_server.model.OnPlayingGamesResponse;
import it.unipr.soi.game_web_server.model.ExistingResponse;
import it.unipr.soi.game_web_server.service.SoiGameWebServerPublicService;

@RestController
@RequestMapping("/public/game")
@CrossOrigin(origins = "http://localhost:80")
public class SoiGameWebServerPublicServiceRest {

    private final SoiGameWebServerPublicService service;

    public SoiGameWebServerPublicServiceRest(SoiGameWebServerPublicService service) {
        this.service = service;
    }

    @GetMapping("/exists/{gameId}")
    public ExistingResponse searchGame(@PathVariable String gameId) {
        return service.searchGame(gameId);
    }
    
    @GetMapping("/exists/{gameId}/{playerId}")
    public ExistingResponse searchPlayer(@PathVariable String gameId, @PathVariable String playerId) {
        return service.searchPlayer(gameId, playerId);
    }
    
    @GetMapping("/onplaying")
    public OnPlayingGamesResponse getNGameIds() {
        return service.getNGameIds();
    }
}
