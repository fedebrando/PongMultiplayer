package it.unipr.soi.game_web_server.service.impl;

import it.unipr.soi.game_web_server.broker.GameDataBroker;
import it.unipr.soi.game_web_server.broker.PlayerBroker;
import it.unipr.soi.game_web_server.model.*;
import it.unipr.soi.game_web_server.repo.PersistenceRepo;
import it.unipr.soi.game_web_server.model.Message.Code;
import it.unipr.soi.game_web_server.model.Message.Type;
import it.unipr.soi.game_web_server.model.Player.Team;
import it.unipr.soi.game_web_server.service.SoiGameWebServerService;

import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.stereotype.Service;

import static it.unipr.soi.game_web_server.utils.SoiGameWebServerConst.*;

import java.util.UUID;

@Service
public class SoiGameWebServerServiceImpl implements SoiGameWebServerService {

    private final MessageSendingOperations<String> messageSendingOperations;
    private final PersistenceRepo persistenceRepo;

    public SoiGameWebServerServiceImpl( //
        MessageSendingOperations<String> messageSendingOperations, //
        PersistenceRepo persistenceRepo //
    ) {
        this.messageSendingOperations = messageSendingOperations;
        this.persistenceRepo = persistenceRepo;
    }

    @Override
    public ExistingResponse searchGame(String gameId) {
    	final boolean exists = persistenceRepo.findGameData().findById(gameId).orElse(null) != null;

    	return new ExistingResponse().exists(exists);
    }
    
    @Override
    public WatchGameResponse watchGame(String gameId) {
        final GameData gameData = persistenceRepo.findGameData().findById(gameId).orElse(null);
        if (gameData == null) {
            return new WatchGameResponse().message(new Message() //
                    .type(Message.Type.ERROR) //
                    .code(Message.Code.GAME_NOT_FOUND));
        }
        final Iterable<Player> players = persistenceRepo.findPlayer().findAllByGameId(gameId);

        final WatchGameResponse response = new WatchGameResponse() //
                .teamsScore(gameData.getTeamsScore())
                .ballAnimation(gameData.getBallAnimation())
                .settings(gameData.getSettings())
                .message(new Message()
		                .type(Message.Type.INFO)
		                .code(Message.Code.WATCH_AVAILABLE));
        players.forEach(response::addPlayer);

        return response;
    }

    @Override
    public RegisterResponse register(String gameId, String playerId, Team team, GameDataSettings settings) {
        final GameData gameDataRead = persistenceRepo.findGameData().findById(gameId).orElse(null);
        final boolean gameDataFound = gameDataRead != null;
        final GameData gameData = gameDataFound ? gameDataRead : new GameData(gameId);

        if (!gameDataFound) {
        	gameData.setSettings(settings);
        	gameData.setBallAnimation(settings.ballLobbyAnimation());
            persistenceRepo.insertGameData().gameData(gameData).apply();
        }
        final Player player = createPlayer(
        		gameId,
        		playerId,
        		team,
        		gameDataFound ? gameDataRead.getSettings() : settings);
        if (player == null) {
            return new RegisterResponse().message(new Message() //
                    .type(Message.Type.ERROR) //
                    .code(Message.Code.PLAYER_ID_ALREADY_USED));
        }

        if (gameData.isPlaying()) {
            player.setReadyToStart(true);
        }
        persistenceRepo.insertPlayer().player(player).apply();

        messageSendingOperations.convertAndSend( //
                TOPIC_GAME_PREFIX + gameId + TOPIC_GAME_PLAYERS_SUFFIX, //
                new PlayerDTO().fromPlayer(player));

        final Iterable<Player> players = persistenceRepo.findPlayer().findAllByGameId(gameId);

        final RegisterResponse response = new RegisterResponse() //
                .teamsScore(gameData.getTeamsScore()) //
                .ballAnimation(gameData.getBallAnimation()) //
                .settings(gameData.getSettings()) //
                .token(player.getToken()) //
		        .message(new Message() //
		                .type(Message.Type.INFO) //
		                .code(Message.Code.GAME_AVAILABLE));
        players.forEach(response::addPlayer);

        return response;
    }

    @Override
    public GameDataDTO startGame(String gameId, StartGameRequest request) {
        final String playerId = retrieveFullPlayerId(gameId, request.getPlayerId());
        /* TODO - Step 1
        Update the readyToStart property of the player and send the new Player
        to the front-end.
        Then, start the game if it can, or reset its ballAnimation to BALL_LOBBY_ANIMATION.
        Finally return the new GameData
         */
        /* TODO - Step 3
        Persist the updates in the repository
         */
    	final GameData game = retrieveGameData(gameId, request.getToken());
    	final GameDataBroker gdb;
    	final Player p = retrievePlayer(gameId, playerId, request.getToken());
    	
    	p.setReadyToStart(true);
    	persistenceRepo.updatePlayer(p.getId()).player(p).apply();
		messageSendingOperations.convertAndSend(
				TOPIC_GAME_PREFIX + gameId + TOPIC_GAME_PLAYERS_SUFFIX, //
                new PlayerDTO().fromPlayer(p));
		if (canGameStart(gameId)) {
			gdb = new GameDataBroker().gameData(game);
    		gdb.startGame();
		}
		else
			game.setBallAnimation(game.getSettings().ballLobbyAnimation());
		persistenceRepo.updateGameData(gameId).gameData(game).apply();
		
    	return new GameDataDTO().ballAnimation(game.getBallAnimation()).teamsScore(game.getTeamsScore());
    }

    @Override
    public PlayerDTO movePlayer(String gameId, MovePlayerRequest request) {
        final String playerId = retrieveFullPlayerId(gameId, request.getPlayerId());
        /* TODO - Step 1
        Update the Y value of the player and return it
         */
    	/* TODO - Step 2
        Update the Y value of the player using PlayerBroker and return it
         */
        /* TODO - Step 3
        Persist the updates in the repository
         */
    	final Player p = retrievePlayer(gameId, playerId, request.getToken());
    	final GameData game = persistenceRepo.findGameData().findById(gameId).orElse(null);
    	if (game == null)
    		throw new GameWebServerException(GAME_NOT_FOUND + gameId);
    	final PlayerBroker pb = new PlayerBroker().player(p).settings(game.getSettings());
    	int numTeamPlayers = 0;
    	final Iterable<Player> players = persistenceRepo.findPlayer().findAllByGameId(gameId);
    	
    	for (final Player player : players)
    		if (player.getTeam() == p.getTeam())
    			numTeamPlayers++;
    	pb.moveToY(request.getY(), numTeamPlayers);
    	persistenceRepo.updatePlayer(p.getId()).player(p).apply();
    	
    	return new PlayerDTO().fromPlayer(p);
    }

    @Override
    public BallAnimation animationEnd(String gameId) {
        final GameData gameData = retrieveGameData(gameId, null);
        final Iterable<Player> players = persistenceRepo.findPlayer().findAllByGameId(gameId);
        final GameDataBroker.UpdateAnimationResult updateAnimationResult = new GameDataBroker() //
                .players(players) //
                .gameData(gameData) //
                .updateAnimation();

        /* TODO - Step 1
        If updateAnimation result is SCORE or NEXT, return the new ballAnimation.
        If updateAnimation result is SCORE, reset every player's readyToStart
        and send to the front-end every new Player
         */
        /* TODO - Step 2
        If updateAnimation result is SCORE or NEXT, return the new ballAnimation.
        If updateAnimation result is SCORE:
            - Reset every player's readyToStart
            - Send to the front-end every new Player
            - Send to every player the message PointScored
         */
        /* TODO - Step 3
        If updateAnimation result is SCORE or NEXT, return the new ballAnimation.
        Otherwise return null.
        If updateAnimation result is SCORE:
            - Reset every player's readyToStart
            - Send to the front-end every new Player
            - Send to every player the message PointScored
        NOTE: Keep in mind to persist the updates in the repository
         */
        
        persistenceRepo.updateGameData(gameId).gameData(gameData).apply();
        if (updateAnimationResult == GameDataBroker.UpdateAnimationResult.SCORE)
        	for (final Player p : players) {
        		p.setReadyToStart(false);
        		persistenceRepo.updatePlayer(p.getId()).player(p).apply();
        		messageSendingOperations.convertAndSend(
        				TOPIC_GAME_PREFIX + gameId + TOPIC_GAME_PLAYERS_SUFFIX, //
                        new PlayerDTO().fromPlayer(p));
        		this.sendMessage(gameId, p.getToken(), Type.INFO, Code.POINT_SCORED);
        	}
        if (updateAnimationResult == GameDataBroker.UpdateAnimationResult.SCORE || //
        		updateAnimationResult == GameDataBroker.UpdateAnimationResult.NEXT)
            return gameData.getBallAnimation();
        return null;
    }
    
	@Override
	public PlayerDTO disconnectPlayer(String gameId, DisconnectPlayerRequest request) {
		final String fullPlayerId = retrieveFullPlayerId(gameId, request.getPlayerId());
		final Player player = retrievePlayer(gameId, fullPlayerId, request.getToken());
		
		// Delete player from the game
		persistenceRepo.removePlayer().removeById(fullPlayerId).apply();
		
		// If game contains no players, then remove it
		final Iterable<Player> remainingPlayers = persistenceRepo.findPlayer().findAllByGameId(gameId);
		final boolean noPlayers = !remainingPlayers.iterator().hasNext();
		if (noPlayers) {
			persistenceRepo.removeGameData().removeById(gameId).apply();
			return null;
		}
		
		// If there is at least one player, then we must warn it about removing
		player.setTeam(Team.REMOVED);
		return new PlayerDTO().fromPlayer(player);
	}

    // Private

    private String retrieveFullPlayerId(String gameId, String playerId) {
        return playerId.concat(PLAYER_ID_SEPARATOR).concat(gameId);
    }

    private GameData retrieveGameData(String gameId, String token) {
        final GameData gameData = persistenceRepo.findGameData().findById(gameId).orElse(null);
        if (gameData == null) {
        	/* TODO - Step 2
            Send a message to the player to notify the error
             */
        	this.sendMessage(gameId, token, Type.ERROR, Code.GAME_NOT_FOUND);
            throw new GameWebServerException(GAME_NOT_FOUND + gameId);
        }
        return gameData;
    }

    private Player retrievePlayer(String gameId, String playerId, String token) {
        final Player player = persistenceRepo.findPlayer().findById(playerId).orElse(null);
        if (player == null) {
        	/* TODO - Step 2
            Send a message to the player to notify the error
             */
        	this.sendMessage(gameId, token, Type.ERROR, Code.PLAYER_NOT_FOUND);
            throw new GameWebServerException(PLAYER_NOT_FOUND + playerId);
        }
        final boolean isValidToken = new PlayerBroker() //
                .player(player) //
                .checkPlayerToken(token);
        if (!isValidToken) {
            /* TODO - Step 2
            Send a message to the player to notify the error
             */
        	this.sendMessage(gameId, token, Type.ERROR, Code.INVALID_PLAYER_TOKEN);
            throw new GameWebServerException(INVALID_PLAYER_TOKEN + playerId);
        }
        return player;
    }

    private Player createPlayer(String gameId, String playerId, Team team, GameDataSettings settings) {
        final String fullPlayerId = retrieveFullPlayerId(gameId, playerId);
        final boolean playerAlreadyExists = persistenceRepo.findPlayer().findById(fullPlayerId).isPresent();
        Player p;
        final String token = UUID.randomUUID().toString();

        if (playerAlreadyExists)
            return null;
        /* TODO - Step 1
        Instantiate and return the new Player
         */
        /* TODO - Step 2
        Add token to the new Player
         */
        /* TODO - Step 3
        Use fullPlayerId as id
         */
        p = new Player();
        p.setId(fullPlayerId);
        p.setGameId(gameId);
        p.setReadyToStart(false);
        p.setTeam(team);
        p.setY(settings.getPlayFieldHeight() / 2);
        p.setToken(token);
        return p;
    }

    private boolean canGameStart(String gameId) {
        /* TODO - Step 1
        The game can start if:
            - All players are ready to start
            - There is at least one player for each team (side)
        */
    	final Iterable<Player> players = persistenceRepo.findPlayer().findAllByGameId(gameId);
    	boolean r = false;
    	boolean l = false;
        
    	for (final Player p : players) {
    		if (!p.isReadyToStart())
    			return false;
    		if (p.getTeam() == Team.LEFT)
    			l = true;
    		if (p.getTeam() == Team.RIGHT)
    			r = true;
    	}
    	return r && l;
    }

    private void sendMessage(String gameId, String token, Message.Type type, Message.Code code) {
        final Message msg = new Message() //
                .type(type) //
                .code(code);
        messageSendingOperations.convertAndSend( //
                TOPIC_GAME_PREFIX + gameId + TOPIC_GAME_MESSAGES_SUFFIX + token, //
                msg);
    }
}
