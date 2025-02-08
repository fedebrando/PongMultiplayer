package it.unipr.soi.game_web_server.repo.builder;

import it.unipr.soi.game_web_server.model.GameData;

import java.util.Optional;

public interface GameDataRepoFindBuilder {

    public Optional<GameData> findById(String id);
}
