package it.unipr.soi.game_web_server.service.impl;

import static it.unipr.soi.game_web_server.utils.SoiGameWebServerConst.PLAYER_ID_SEPARATOR;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import it.unipr.soi.game_web_server.model.GameData;
import it.unipr.soi.game_web_server.model.OnPlayingGamesResponse;
import it.unipr.soi.game_web_server.model.ExistingResponse;
import it.unipr.soi.game_web_server.repo.GameDataRepo;
import it.unipr.soi.game_web_server.repo.PlayerRepo;
import it.unipr.soi.game_web_server.service.SoiGameWebServerPublicService;
import it.unipr.soi.game_web_server.utils.SoiGameWebServerConst;

@Service
public class SoiGameWebServerPublicServiceImpl implements SoiGameWebServerPublicService {

	private final GameDataRepo gameDataRepo;
	private final PlayerRepo playerRepo;
	
	public SoiGameWebServerPublicServiceImpl(GameDataRepo gameDataRepo, PlayerRepo playerRepo) {
		this.gameDataRepo = gameDataRepo;
		this.playerRepo = playerRepo;
	}

	@Override
	public ExistingResponse searchGame(String gameId) {
		return new ExistingResponse().exists(gameDataRepo.existsById(gameId));
	}
	
	@Override
	public ExistingResponse searchPlayer(String gameId, String playerId) {
		return new ExistingResponse().exists(playerRepo.existsById(retrieveFullPlayerId(gameId, playerId)));
	}

	@Override
	public OnPlayingGamesResponse getNGameIds() {
		Iterable<GameData> games = gameDataRepo.findAll(PageRequest.of(0, SoiGameWebServerConst.N_GAME_IDS));
		OnPlayingGamesResponse response = new OnPlayingGamesResponse();
		
		games.forEach(game -> response.addGameId(game.getId()));
		return response;
	}
	
	// Private
	
    private String retrieveFullPlayerId(String gameId, String playerId) {
        return playerId.concat(PLAYER_ID_SEPARATOR).concat(gameId);
    }
}
