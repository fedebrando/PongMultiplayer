package it.unipr.soi.game_web_server.repo.builder;

public interface PlayerRepoRemoveBuilder {

    public PlayerRepoRemoveBuilder removeById(String id);
    
    public void apply();
}
