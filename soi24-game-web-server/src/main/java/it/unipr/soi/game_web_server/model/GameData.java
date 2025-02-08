package it.unipr.soi.game_web_server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serial;
import java.io.Serializable;

@RedisHash("GameData")
public class GameData implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    private final String id;

    private long createdAt;
    private boolean isPlaying;
    private TeamsScore teamsScore;
    private BallAnimation ballAnimation;
    private GameDataSettings settings;

    public GameData(String id) {
        this.id = id;
        this.createdAt = System.currentTimeMillis();
        this.isPlaying = false;
        this.teamsScore = new TeamsScore();
        this.settings = new GameDataSettings();
        this.ballAnimation = this.settings.ballLobbyAnimation();
    }

    public String getId() {
        return id;
    }
    
    public long getCreatedAt() {
    	return createdAt;
    }
    
    public void setCreatedAt(long createdAt) {
    	this.createdAt = createdAt;
    }

    public boolean isPlaying() {
        return isPlaying;
    }

    public void setPlaying(boolean playing) {
        isPlaying = playing;
    }

    public TeamsScore getTeamsScore() {
        return teamsScore;
    }

    public void setTeamsScore(TeamsScore teamsScore) {
        this.teamsScore = teamsScore;
    }

    public BallAnimation getBallAnimation() {
        return ballAnimation;
    }

    public void setBallAnimation(BallAnimation ballAnimation) {
        this.ballAnimation = ballAnimation;
    }
    
    public GameDataSettings getSettings() {
    	return this.settings;
    }
    
    public void setSettings(GameDataSettings settings) {
    	this.settings = settings;
    }
}
