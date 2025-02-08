//import { writeHeapSnapshot } from 'v8'
import Player from './Player'
import { MS_PER_FRAME } from './const'
import { GameDataSettings, PlayerPosition, playerStep } from './interfaces'

export default class Arena {
    private msPrevFrame: number
    private player?: Player
    private numTeamPlayers: number
    private settings?: GameDataSettings

    constructor() {
        this.msPrevFrame = window.performance.now()
        this.numTeamPlayers = 0
    }

    public getPlayer() {
        return this.player
    }

    public getNumTeamPlayers() {
        return this.numTeamPlayers
    }

    public getSettings() {
        return this.settings
    }

    public setPlayerPosition(playerPosition: PlayerPosition) {
        /* TODO - Step 1
        If the player is already present, set its new position.
        Otherwise instantiate it and call animate
        */
        if (this.player)
            this.player.setPosition(playerPosition)
        else {
            this.player = new Player(playerPosition)
            // Arena can't know if setNumTeamPlayers(.) is called out
            if (this.numTeamPlayers === 0)
                this.setNumTeamPlayers(1)
            this.msPrevFrame = window.performance.now()
            this.animate()
        }
    }

    public setNumTeamPlayers(numTeamPlayers: number) {
        this.numTeamPlayers = numTeamPlayers
    }

    public setSettings(settings: GameDataSettings) {
        this.settings = settings
    }

    public animate() {
        if (this.player && this.settings) {
            window.requestAnimationFrame(this.animate.bind(this))
            const msNow = window.performance.now()
            const msPrev = this.msPrevFrame
            const msDelta = msNow - msPrev
            if (msDelta >= MS_PER_FRAME) {
                // Valid frame
                /* TODO - Step 0
                Animate all the players and eventually the ball (only if its last animation ended)
                */
                /* TODO - Step 1
                Remove Step 0 code
                */
                this.player.animate(this.settings.playerHeight / this.numTeamPlayers, this.settings.playFieldHeight, playerStep(this.settings))
                const excessTime = msDelta % MS_PER_FRAME
                this.msPrevFrame = msNow - excessTime
            }
        }
    }
}
