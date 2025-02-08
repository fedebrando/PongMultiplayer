package it.unipr.soi.game_web_server.model;

import java.util.ArrayList;
import java.util.List;

public class OnPlayingGamesResponse {
	
    private List<String> gameIds;

    public OnPlayingGamesResponse() {
    	this.gameIds = new ArrayList<>();
    }

    public List<String> getGameIds() {
    	return this.gameIds;
    }
    
    public void setGameIds(List<String> gameIds) {
    	this.gameIds = gameIds;
    }
    
    public OnPlayingGamesResponse gameIds(List<String> gameIds) {
    	this.setGameIds(gameIds);
    	return this;
    }
    
    public void addGameId(String gameId) {
    	this.gameIds.add(gameId);
    }
}
