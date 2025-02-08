package it.unipr.soi.game_web_server.repo.builder.impl;

import java.util.Optional;

import it.unipr.soi.game_web_server.model.Player;
import it.unipr.soi.game_web_server.repo.PlayerRepo;
import it.unipr.soi.game_web_server.repo.builder.PlayerRepoRemoveBuilder;

public class PlayerRepoRemoveBuilderImpl implements PlayerRepoRemoveBuilder {

    private final PlayerRepo playerRepo;
    private Optional<Player> player;

    public PlayerRepoRemoveBuilderImpl(PlayerRepo playerRepo) {
        this.playerRepo = playerRepo;
    }

	@Override
	public PlayerRepoRemoveBuilder removeById(String id) {
		this.player = playerRepo.findById(id);
		return this;
	}

	@Override
	public void apply() {
		playerRepo.delete(player.get());
	}
}
