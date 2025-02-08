package it.unipr.soi.game_web_server.utils;

import it.unipr.soi.game_web_server.broker.BallAnimationBroker;
import it.unipr.soi.game_web_server.model.BallAnimation;

public class SoiGameWebServerConst {

    public static final String TOPIC_GAME_PREFIX = "/topic/game.";
    public static final String TOPIC_GAME_PLAYERS_SUFFIX = ".players";
    public static final String TOPIC_GAME_MESSAGES_SUFFIX = ".messages.";

    public static final String GAME_NOT_FOUND = "GameId not found: ";
    public static final String PLAYER_NOT_FOUND = "Player not found: ";
    public static final String PLAYER_ID_ALREADY_USED = "PlayerId already used: ";
    public static final String INVALID_PLAYER_TOKEN = "Invalid token for player: ";

    public static final String PLAYER_ID_SEPARATOR = "@";

    public static final int PLAYFIELD_WIDTH = 1000;
    public static final int PLAYFIELD_HEIGHT = 750;

    public static final int FPS = 60;
    public static final double MS_PER_FRAME = 1000f / FPS;

    public static final int BALL_DIAMETER = 20;
    public static final int BALL_RADIUS = BALL_DIAMETER / 2;
    public static final double BALL_SPEED = (double) PLAYFIELD_WIDTH / 2;
    public static final int BALL_INITIAL_X = PLAYFIELD_WIDTH / 2;
    public static final int BALL_INITIAL_Y = PLAYFIELD_HEIGHT / 2;
    public static final double BALL_INITIAL_DIRECTION = Math.PI;
    public static final BallAnimation BALL_LOBBY_ANIMATION = new BallAnimationBroker() //
            .x(BALL_INITIAL_X) //
            .y(BALL_INITIAL_Y) //
            .build();

    public static final int PLAYER_WIDTH = 10;
    public static final int PLAYER_HEIGHT = 100;
    public static final int PLAYER_RADIUS = Math.min(PLAYER_WIDTH, PLAYER_HEIGHT) / 2;
    public static final double PLAYER_SPEED = (double) PLAYFIELD_HEIGHT / 3;
    public static final int PLAYER_STEP = (int) (PLAYER_SPEED / FPS);

    public static final int PLAYER_MIN_Y = PLAYER_HEIGHT / 2;
    public static final int PLAYER_MAX_Y = PLAYFIELD_HEIGHT - PLAYER_HEIGHT / 2;
    public static final int PLAYER_LEFT_X = PLAYFIELD_WIDTH / 20;
    public static final int PLAYER_RIGHT_X = PLAYFIELD_WIDTH - PLAYER_LEFT_X;

    public static final int MIN_X = PLAYER_LEFT_X + BALL_RADIUS;
    public static final int MAX_X = PLAYER_RIGHT_X - BALL_RADIUS;
    public static final int MIN_Y = BALL_RADIUS;
    public static final int MAX_Y = PLAYFIELD_HEIGHT - BALL_RADIUS;
    
    /* Max latency limit in ms */
    
    public static final int MAX_LATENCY = 100;
    
    /* Settings check */
    
    public static final int MIN_PLAYFIELD_WIDTH = 200;
    public static final int MAX_PLAYFIELD_WIDTH = 2000;
    public static final int MIN_PLAYFIELD_HEIGHT = 200;
    public static final int MAX_PLAYFIELD_HEIGHT = 800;
    
    public static final int MIN_PLAYER_HEIGHT = 30;
    public static final int MAX_PLAYER_HEIGHT = 170;
    
    public static final int MIN_BALL_DIAMETER = 10;
    public static final int MAX_BALL_DIAMETER = 50;
    
    public static final double MIN_BALL_SPEED = 200;
    public static final double MAX_BALL_SPEED = 1000;
    
    public static final double MIN_PLAYER_SPEED = 100;
    public static final double MAX_PLAYER_SPEED = 500;
    
    /* Public service API */
    
    public static final int N_GAME_IDS = 10;

    private SoiGameWebServerConst() {
        // no instance
    }
}
