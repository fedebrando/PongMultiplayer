package it.unipr.soi.game_web_server.repo.builder.impl;

import java.util.Optional;

import it.unipr.soi.game_web_server.model.GameData;
import it.unipr.soi.game_web_server.repo.GameDataRepo;
import it.unipr.soi.game_web_server.repo.builder.GameDataRepoRemoveBuilder;

public class GameDataRepoRemoveBuilderImpl implements GameDataRepoRemoveBuilder {

    private final GameDataRepo gameDataRepo;
    private Optional<GameData> gameData;

    public GameDataRepoRemoveBuilderImpl(GameDataRepo gameDataRepo) {
        this.gameDataRepo = gameDataRepo;
    }

	@Override
	public GameDataRepoRemoveBuilder removeById(String id) {
		this.gameData = gameDataRepo.findById(id);
		return this;
	}

	@Override
	public void apply() {
		gameDataRepo.delete(gameData.get());	
	}
}
