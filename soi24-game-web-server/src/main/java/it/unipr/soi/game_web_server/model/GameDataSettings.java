package it.unipr.soi.game_web_server.model;

import it.unipr.soi.game_web_server.broker.BallAnimationBroker;
import it.unipr.soi.game_web_server.utils.SoiGameWebServerConst;

import java.io.Serial;
import java.io.Serializable;

public class GameDataSettings implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;
    
    private int playFieldWidth = SoiGameWebServerConst.PLAYFIELD_WIDTH;
    private int playFieldHeight = SoiGameWebServerConst.PLAYFIELD_HEIGHT;
    private int playerHeight = SoiGameWebServerConst.PLAYER_HEIGHT;
    private int ballDiameter = SoiGameWebServerConst.BALL_DIAMETER;
    private double ballSpeed = SoiGameWebServerConst.BALL_SPEED;
    private double playerSpeed = SoiGameWebServerConst.PLAYER_SPEED;
    
    public int getPlayFieldWidth() {
    	return this.playFieldWidth;
    }
    
    public void setPlayFieldWidth(int playFieldWidth) {
    	if (SoiGameWebServerConst.MIN_PLAYFIELD_WIDTH <= playFieldWidth &&
    			playFieldWidth <= SoiGameWebServerConst.MAX_PLAYFIELD_WIDTH)
    		this.playFieldWidth = playFieldWidth;
    }
    
    public int getPlayFieldHeight() {
    	return this.playFieldHeight;
    }
    
    public void setPlayFieldHeight(int playFieldHeight) {
    	if (SoiGameWebServerConst.MIN_PLAYFIELD_HEIGHT <= playFieldHeight &&
    			playFieldHeight <= SoiGameWebServerConst.MAX_PLAYFIELD_HEIGHT)
    			this.playFieldHeight = playFieldHeight;
    }
    
    public int getPlayerHeight() {
    	return this.playerHeight;
    }
    
    public void setPlayerHeight(int playerHeight) {
    	if (SoiGameWebServerConst.MIN_PLAYER_HEIGHT <= playerHeight &&
    			playerHeight <= SoiGameWebServerConst.MAX_PLAYER_HEIGHT)
    		this.playerHeight = playerHeight;
    }
    
    public int getBallDiameter() {
    	return this.ballDiameter;
    }
    
    public void setBallDiameter(int ballDiameter) {
    	if (SoiGameWebServerConst.MIN_BALL_DIAMETER <= ballDiameter &&
    			ballDiameter <= SoiGameWebServerConst.MAX_BALL_DIAMETER)
    		this.ballDiameter = ballDiameter;
    }
    
    public double getBallSpeed() {
    	return this.ballSpeed;
    }
    
    public void setBallSpeed(double ballSpeed) {
    	if (SoiGameWebServerConst.MIN_BALL_SPEED <= ballSpeed &&
    			ballSpeed <= SoiGameWebServerConst.MAX_BALL_SPEED)
    		this.ballSpeed = ballSpeed;
    }
    
    public double getPlayerSpeed() {
    	return this.playerSpeed;
    }
    
    public void setPlayerSpeed(double playerSpeed) {
    	if (SoiGameWebServerConst.MIN_PLAYER_SPEED <= playerSpeed &&
    			playerSpeed <= SoiGameWebServerConst.MAX_PLAYER_SPEED)
    		this.playerSpeed = playerSpeed;
    }
    
    /* Other derived settings */
    
    public int ballInitialX() {
    	return this.getPlayFieldWidth() / 2;
    }
    
    public int ballInitialY() {
    	return this.getPlayFieldHeight() / 2;
    }
    
    public BallAnimation ballLobbyAnimation() {
    	return new BallAnimationBroker() //
                .x(this.ballInitialX()) //
                .y(this.ballInitialY()) //
                .settings(this)
                .build();
    }
    
    public int playerLeftX() {
    	return this.getPlayFieldWidth() / 20;
    }
    
    public int playerRightX() {
    	return this.getPlayFieldWidth() - this.playerLeftX();
    }
    
    public int playerRadius() {
    	return Math.min(SoiGameWebServerConst.PLAYER_WIDTH, this.getPlayerHeight()) / 2;
    }
    
    public int playerMinY() {
    	return this.getPlayerHeight() / 2;
    }
    
    public int playerMaxY() {
    	return this.getPlayFieldHeight() - this.getPlayerHeight() / 2;
    }
    
    public int ballRadius() {
    	return this.getBallDiameter() / 2;
    }
    
    public int minX() {
    	return this.playerLeftX() + this.ballRadius();
    }
    
    public int maxX() {
    	return this.playerRightX() - this.ballRadius();
    }
    
    public int minY() {
    	return this.ballRadius();
    }
    
    public int maxY() {
    	return this.getPlayFieldHeight() - this.ballRadius();
    }
    
    public int playerStep() {
    	return (int) this.getPlayerSpeed() / SoiGameWebServerConst.FPS;
    }
}
