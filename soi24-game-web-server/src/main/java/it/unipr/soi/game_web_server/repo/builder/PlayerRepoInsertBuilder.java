package it.unipr.soi.game_web_server.repo.builder;

import it.unipr.soi.game_web_server.model.Player;

public interface PlayerRepoInsertBuilder {

    public PlayerRepoInsertBuilder player(Player player);

    public void apply();
}
