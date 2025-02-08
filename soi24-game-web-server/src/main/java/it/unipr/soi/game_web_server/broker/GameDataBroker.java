package it.unipr.soi.game_web_server.broker;

import static it.unipr.soi.game_web_server.utils.SoiGameWebServerConst.*;

import it.unipr.soi.game_web_server.model.BallAnimation;
import it.unipr.soi.game_web_server.model.BallCollisionResult;
import it.unipr.soi.game_web_server.model.GameData;
import it.unipr.soi.game_web_server.model.Player;
import it.unipr.soi.game_web_server.utils.SoiGameWebServerConst;

public class GameDataBroker {

    private GameData gameData;
    private Iterable<Player> players;

    public enum UpdateAnimationResult {
        /**
         * The request has been declined
         */
        NONE,
        /**
         * There is a new animation available
         */
        NEXT,
        /**
         * One team scored
         */
        SCORE
    }

    public GameDataBroker gameData(GameData gameData) {
        this.gameData = gameData;
        return this;
    }

    public GameDataBroker players(Iterable<Player> players) {
        this.players = players;
        return this;
    }

    public void startGame() {
        if (!gameData.isPlaying()) {
            gameData.setBallAnimation(new BallAnimationBroker() //
                    .x(gameData.getSettings().ballInitialX()) //
                    .y(gameData.getSettings().ballInitialY()) //
                    .direction(BALL_INITIAL_DIRECTION) //
                    .settings(gameData.getSettings()) //
                    .build());
            gameData.setPlaying(true);
        }
    }

    /**
     * Request to update the {@link BallAnimation}
     *
     * @return UpdateAnimationResult
     */
    public UpdateAnimationResult updateAnimation() {
        if (gameData.isPlaying()) {
            final BallAnimation ballAnimation = gameData.getBallAnimation();
            if (ballAnimation.getEndTimestamp() <= System.currentTimeMillis() + SoiGameWebServerConst.MAX_LATENCY) {
                final BallCollisionResult ballCollisionResult = new BallAnimationBroker() //
                        .ballAnimation(ballAnimation) //
                        .settings(gameData.getSettings()) //
                        .collision(players);
                if (ballCollisionResult == null) {
                    return UpdateAnimationResult.NEXT;
                }
                if (ballCollisionResult == BallCollisionResult.RIGHT_TEAM_POINT) {
                    gameData.getTeamsScore().increaseRightTeamScore();
                } else if (ballCollisionResult == BallCollisionResult.LEFT_TEAM_POINT) {
                    gameData.getTeamsScore().increaseLeftTeamScore();
                }
                gameData.setPlaying(false);
                return UpdateAnimationResult.SCORE;
            }
        }
        return UpdateAnimationResult.NONE;
    }
}
