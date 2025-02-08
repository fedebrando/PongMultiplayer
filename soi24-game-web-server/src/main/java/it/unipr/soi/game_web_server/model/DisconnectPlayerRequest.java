package it.unipr.soi.game_web_server.model;

public class DisconnectPlayerRequest {

    private String token;
    private String playerId;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }
}
