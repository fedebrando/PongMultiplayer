package it.unipr.soi.game_web_server.service;

import it.unipr.soi.game_web_server.model.*;
import it.unipr.soi.game_web_server.model.Player.Team;

public interface SoiGameWebServerService {

	ExistingResponse searchGame(String gameId);
	
    WatchGameResponse watchGame(String gameId);

    RegisterResponse register(String gameId, String playerId, Team team, GameDataSettings settings);

    GameDataDTO startGame(String gameId, StartGameRequest request);

    PlayerDTO movePlayer(String gameId, MovePlayerRequest request);

    BallAnimation animationEnd(String gameId);
    
    PlayerDTO disconnectPlayer(String gameId, DisconnectPlayerRequest request);
}
