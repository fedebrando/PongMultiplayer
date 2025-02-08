package it.unipr.soi.game_web_server.rest;

import it.unipr.soi.game_web_server.model.*;
import it.unipr.soi.game_web_server.model.Player.Team;
import it.unipr.soi.game_web_server.service.SoiGameWebServerService;
import it.unipr.soi.game_web_server.utils.SoiGameWebServerConst;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
public class SoiGameWebServerController {

    private final SoiGameWebServerService service;

    public SoiGameWebServerController(SoiGameWebServerService service) {
        this.service = service;
    }

    @SubscribeMapping("game.{gameId}.search")
    public ExistingResponse searchGame(@DestinationVariable String gameId) {
    	return service.searchGame(gameId);
    }
    
    @SubscribeMapping("game.{gameId}")
    public WatchGameResponse watchGame(@DestinationVariable String gameId) {
        return service.watchGame(gameId);
    }

    @SubscribeMapping("game.{gameId}.player.{playerId}.team.{team}.settings.{settings}")
    public RegisterResponse register(
    		@DestinationVariable String gameId,
    		@DestinationVariable String playerId,
    		@DestinationVariable String team,
    		@DestinationVariable String settings
    ) {
    	ObjectMapper mapper = new ObjectMapper();
        GameDataSettings settingsParsed;
        
        try {
        	settingsParsed = mapper.readValue(settings, GameDataSettings.class);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("JSON deserialization: ", e);
        }
        
        return service.register(
        		gameId,
        		playerId,
        		team.equals("left") ? Team.LEFT : Team.RIGHT,
        		settingsParsed
        );
    }

    @MessageMapping("game.{gameId}.start")
    @SendTo(SoiGameWebServerConst.TOPIC_GAME_PREFIX + "{gameId}")
    public GameDataDTO startGame(@DestinationVariable String gameId, StartGameRequest request) {
        return service.startGame(gameId, request);
    }

    @MessageMapping("game.{gameId}.position")
    @SendTo(SoiGameWebServerConst.TOPIC_GAME_PREFIX + "{gameId}.players")
    public PlayerDTO movePlayer(@DestinationVariable String gameId, MovePlayerRequest request) {
        return service.movePlayer(gameId, request);
    }

    @MessageMapping("game.{gameId}.animation")
    @SendTo(SoiGameWebServerConst.TOPIC_GAME_PREFIX + "{gameId}.ball")
    public BallAnimation animationEnd(@DestinationVariable String gameId) {
        return service.animationEnd(gameId);
    }
    
    @MessageMapping("game.{gameId}.disconnect")
    @SendTo(SoiGameWebServerConst.TOPIC_GAME_PREFIX + "{gameId}.players")
    public PlayerDTO disconnectPlayer(@DestinationVariable String gameId, DisconnectPlayerRequest request) {
        return service.disconnectPlayer(gameId, request);
    }
}
