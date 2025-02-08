package it.unipr.soi.game_web_server.model;

import java.util.ArrayList;
import java.util.List;

public class WatchGameResponse extends GameDataDTO {

    private List<PlayerDTO> players;
    private Message message;
    private GameDataSettings settings;

    public WatchGameResponse() {
        this.players = new ArrayList<>();
    }

    @Override
    public WatchGameResponse teamsScore(TeamsScore teamsScore) {
        super.teamsScore(teamsScore);
        return this;
    }

    @Override
    public WatchGameResponse ballAnimation(BallAnimation ballAnimation) {
        super.ballAnimation(ballAnimation);
        return this;
    }

    public List<PlayerDTO> getPlayers() {
        return players;
    }

    public void setPlayers(List<PlayerDTO> players) {
        this.players = players;
    }

    public void addPlayer(Player player) {
        final PlayerDTO playerDTO = new PlayerDTO().fromPlayer(player);
        this.players.add(playerDTO);
    }

    public Message getMessage() {
        return message;
    }

    public void setMessage(Message message) {
        this.message = message;
    }

    public WatchGameResponse message(Message message) {
        setMessage(message);
        return this;
    }
    
    public GameDataSettings getSettings() {
    	return this.settings;
    }
    
    public void setSettings(GameDataSettings settings) {
    	this.settings = settings;
    }
    
    public WatchGameResponse settings(GameDataSettings settings) {
    	setSettings(settings);
    	return this;
    }
}
