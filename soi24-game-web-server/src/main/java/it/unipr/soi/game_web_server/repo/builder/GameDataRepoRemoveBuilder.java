package it.unipr.soi.game_web_server.repo.builder;

public interface GameDataRepoRemoveBuilder {

    public GameDataRepoRemoveBuilder removeById(String id);
    
    public void apply();
}
