package it.unipr.soi.game_web_server.broker;

import it.unipr.soi.game_web_server.model.GameDataSettings;
import it.unipr.soi.game_web_server.model.Player;
import it.unipr.soi.game_web_server.utils.SoiGameWebServerConst;

public class PlayerBroker {

    private final long nowTimestamp;

    private Player player;
    private GameDataSettings settings;

    public PlayerBroker() {
        this.nowTimestamp = System.currentTimeMillis();
    }

    public PlayerBroker player(Player player) {
        this.player = player;
        return this;
    }
    
    public PlayerBroker settings(GameDataSettings settings) {
    	this.settings = settings;
    	return this;
    }

    /**
     * Compares the provided token with the originally saved one
     *
     * @param  token Token to compare
     * @return       true if the token is correct, false otherwise
     */
    public boolean checkPlayerToken(String token) {
        /* TODO - Step 2
        Return true if the token is correct (and not null), false otherwise
         */
    	if (token == null)
    		return false;
    	return token.equals(this.player.getToken());
    }

    /**
     * Moves the player applying validation, blocking cheaters. Allows the player to
     * move only for at most his defined step every frame.
     *
     * @param y The new position along the Y axis
     */
    public void moveToY(int y, int numTeamPlayers) {
        /* TODO - Step 2
        Set the new y and lastMovementTimestamp of the player only if:
        - the new value is between PLAYER_MIN_Y and PLAYER_MAX_Y
        - the distance between old and new y values is less or equal to elapsedFrames * PLAYER_STEP
         */
    	final int correctMinY = settings.playerMinY() / numTeamPlayers; // In case of more players in the same team
    	final int correctMaxY = settings.getPlayFieldHeight() - settings.getPlayerHeight() / (2*numTeamPlayers);
    	long elapsedFrames = (this.nowTimestamp - this.player.getLastMovementTimestamp()) / (long)SoiGameWebServerConst.MS_PER_FRAME;
    	
    	if (correctMinY <= y && y <= correctMaxY &&
    			Math.abs(y - this.player.getY()) <= elapsedFrames * settings.playerStep()) {
    		this.player.setY(y);
    		this.player.setLastMovementTimestamp(this.nowTimestamp);
    	}
    }
}
