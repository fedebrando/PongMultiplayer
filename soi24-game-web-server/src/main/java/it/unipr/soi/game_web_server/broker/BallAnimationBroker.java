package it.unipr.soi.game_web_server.broker;

import it.unipr.soi.game_web_server.model.BallAnimation;
import it.unipr.soi.game_web_server.model.BallCollisionResult;
import it.unipr.soi.game_web_server.model.GameDataSettings;
import it.unipr.soi.game_web_server.model.Player;
import it.unipr.soi.game_web_server.model.Player.Team;

import static it.unipr.soi.game_web_server.model.BallCollisionResult.LEFT_TEAM_POINT;
import static it.unipr.soi.game_web_server.model.BallCollisionResult.RIGHT_TEAM_POINT;

public class BallAnimationBroker {

    private static final double SIN_COS_EPSILON = 0.01;

    private BallAnimation ballAnimation;
    private GameDataSettings settings;
    private int x;
    private int y;
    private Double direction;

    public BallAnimationBroker ballAnimation(BallAnimation ballAnimation) {
        this.ballAnimation = ballAnimation;
        return this;
    }
    
    public BallAnimationBroker settings(GameDataSettings settings) {
    	this.settings = settings;
    	return this;
    }

    public BallAnimationBroker x(int x) {
        this.x = x;
        return this;
    }

    public BallAnimationBroker y(int y) {
        this.y = y;
        return this;
    }

    public BallAnimationBroker direction(double direction) {
        this.direction = direction;
        return this;
    }

    public BallAnimation build() {
        this.ballAnimation = new BallAnimation();
        this.ballAnimation.setTime(Double.MAX_VALUE);
        this.ballAnimation.setEndTimestamp(Long.MAX_VALUE);
        if (this.direction != null) {
            updateValues(this.x, this.y, this.direction);
        } else {
            this.ballAnimation.setStartX(this.x);
            this.ballAnimation.setEndX(this.x);
            this.ballAnimation.setStartY(this.y);
            this.ballAnimation.setEndY(this.y);
        }
        return this.ballAnimation;
    }

    /**
     * Check if there is a collision and updates the ball animation
     *
     * @param  players All the players in the game
     * @return         a {@link BallCollisionResult} if no collision detected, null
     *                 otherwise
     */
    public BallCollisionResult collision(Iterable<Player> players) {
        final int startX = this.ballAnimation.getStartX();
        final int startY = this.ballAnimation.getStartY();
        final CollisionContext cc = new CollisionContext();
        final int[] numLeftRightPlayers = numTeamsPlayers(players);

        cc.endX = this.ballAnimation.getEndX();
        cc.endY = this.ballAnimation.getEndY();

        // Direction inversion because Y increase upward, while top downward
        cc.direction = Math.atan2((double) -cc.endY + startY, (double) cc.endX - startX);

        boolean collision = false;
        // Collision detection with walls
        if (cc.endY == settings.minY() || cc.endY == settings.maxY()) {
            cc.direction = -cc.direction;
            collision = true;
        }

        // Collision detection with players
        if (cc.endX == settings.minX() || cc.endX == settings.maxX()) {
        	final Player ballClosestPlayer = findBallClosestPlayer(players, cc); // For giving priority to horizontal collisions
        	if (ballClosestPlayer == null)
        		collision = false;
        	else
        		collision = matchPlayer(
        				ballClosestPlayer,
        				cc,
			            ballClosestPlayer.getTeam() == Team.LEFT ?
			            		numLeftRightPlayers[Team.LEFT.ordinal()] : numLeftRightPlayers[Team.RIGHT.ordinal()]);
        }

        if (!collision) {
            return cc.endX == settings.maxX() ? LEFT_TEAM_POINT : RIGHT_TEAM_POINT;
        }
        updateValues(cc.endX, cc.endY, cc.direction);
        return null;
    }
    
    /**
     * Find the ball-closest player
     * (Precondition: ball must have the same X of at least one player)
     * @param players All players in the game
     * @param cc The ball collision context
     * @return The ball-closest player
     */
    Player findBallClosestPlayer(Iterable<Player> players, CollisionContext cc) {
    	final Team team = (cc.endX == settings.minX() ? Team.LEFT : Team.RIGHT);
    	Player closest = null;
    	int minDistance = settings.getPlayFieldHeight();
    	int currDistance;
    	
    	for (final Player p : players) {
    		if (p.getTeam() != team)
    			continue;
    		currDistance = Math.abs(cc.endY - p.getY());
    		if (currDistance < minDistance) {
    			minDistance = currDistance;
    			closest = p;
    		}
    	}
    	return closest;
    }

    /**
     * Computes left-team and right-team players numbers
     * @param players All players that play in this game
     * @return left-team and right-team players numbers in an array
     */
    private int[] numTeamsPlayers(Iterable<Player> players) {
        int numLeftPlayers = 0;
        int numRightPlayers = 0;
        
        for (final Player p : players)
        	if (p.getTeam() == Team.LEFT)
        		numLeftPlayers++;
        	else
        		numRightPlayers++;
        return new int[]{numLeftPlayers, numRightPlayers};
    }
    
    private boolean matchPlayer(Player p, CollisionContext cc, int numTeamPlayers) {
        final int playerPosX = p.getTeam() == Player.Team.LEFT //
                ? settings.playerLeftX() //
                : settings.playerRightX();
        final int playerHeight = settings.getPlayerHeight() / numTeamPlayers;
        
        if (Math.abs(playerPosX - cc.endX) > settings.ballRadius()) {
            return false;
        }
        final int deltaV = Math.abs(cc.endY - p.getY());
        if (deltaV > settings.ballRadius() + playerHeight / 2) {
            return false;
        }
        if (deltaV <= playerHeight / 2 - settings.playerRadius()) {
            // Horizontal collision
            cc.direction = (Math.PI - cc.direction) % (2 * Math.PI);
        } else {
            // Corner collision
            final int dY = cc.endY > p.getY() //
                    ? cc.endY - (p.getY() + playerHeight / 2 - settings.playerRadius())
                    : cc.endY - (p.getY() - playerHeight / 2 + settings.playerRadius());
            final int dX = cc.endX - playerPosX;
            // Normal of the collision plane
            cc.direction = Math.atan2(-dY, dX);
        }
        return true;
    }

    private void updateValues(int x, int y, double direction) {
        // Collision prediction
        final UpdateContext uc = new UpdateContext();
        uc.cos = Math.cos(direction);
        uc.sin = Math.sin(direction);

        if (Math.abs(uc.sin) < SIN_COS_EPSILON) {
            uc.nextX = uc.cos > 0 ? settings.maxX() : settings.minX();
            uc.nextY = y;
        } else if (Math.abs(uc.cos) < SIN_COS_EPSILON) {
            uc.nextX = x;
            uc.nextY = uc.sin > 0 ? settings.minY() : settings.maxY();
        } else {
            calcDiagonalNext(x, y, direction, uc);
        }

        final int collisionDistX = uc.nextX - x;
        final int collisionDistY = uc.nextY - y;
        final double collisionDist = Math.sqrt( //
                (double) collisionDistX * collisionDistX //
                        + collisionDistY * collisionDistY //
        );
        final double collisionTime = collisionDist / settings.getBallSpeed();
        final long collisionTimeMs = (long) (collisionTime * 1000);

        this.ballAnimation.setStartX(x);
        this.ballAnimation.setStartY(y);
        this.ballAnimation.setEndX(uc.nextX);
        this.ballAnimation.setEndY(uc.nextY);
        this.ballAnimation.setTime(collisionTime);
        this.ballAnimation.setEndTimestamp(System.currentTimeMillis() + collisionTimeMs);
    }

    private void calcDiagonalNext(int x, int y, double direction, UpdateContext uc) {
        final double m = Math.tan(-direction);
        final double q = y - m * x;
        // Y = mX + q

        final int wallX = uc.cos > 0 ? settings.maxX() : settings.minX();
        final int wallY = uc.sin > 0 ? settings.minY() : settings.maxY();

        final int wallDistY = uc.sin > 0 ? y - settings.minY() : settings.maxY() - y;

        final int intersectionY = (int) (m * wallX + q);
        if (Math.abs(intersectionY - y) <= wallDistY) {
            uc.nextX = wallX;
            uc.nextY = intersectionY;
        } else {
            uc.nextX = (int) ((wallY - q) / m);
            uc.nextY = wallY;
        }
    }

    private static class CollisionContext {
        private int endX;
        private int endY;
        private double direction;
    }

    private static class UpdateContext {
        private double cos;
        private double sin;
        private int nextX;
        private int nextY;
    }
}
