package it.unipr.soi.game_web_server.service;

import it.unipr.soi.game_web_server.model.OnPlayingGamesResponse;
import it.unipr.soi.game_web_server.model.ExistingResponse;

public interface SoiGameWebServerPublicService {

    ExistingResponse searchGame(String gameId);
    
    ExistingResponse searchPlayer(String gameId, String playerId);
    
    OnPlayingGamesResponse getNGameIds();
}
