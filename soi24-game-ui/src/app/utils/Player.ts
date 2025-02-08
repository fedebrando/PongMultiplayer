import { PlayerDirection, PlayerPosition } from './interfaces'

export default class Player {
    private direction: PlayerDirection

    constructor(
        private position: PlayerPosition,
        private onChangePositionY?: (playerPositionY: number) => void
    ) {
        this.direction = PlayerDirection.Hold
    }

    public getPosition() {
        return this.position
    }

    public setPosition(position: PlayerPosition) {
        this.position = position
    }

    public getDirection() {
        return this.direction
    }

    public setDirection(direction: PlayerDirection) {
        this.direction = direction
    }

    public setOnChangePositionY(onChangePositionY: (playerPositionY: number) => void) {
        this.onChangePositionY = onChangePositionY
    }

    public animate(playerHeight: number, playFieldHeight: number, playerStep: number) {

        const y = this.position.y
        let newY = y

        switch (this.direction) {
            case PlayerDirection.Up:
                newY = Math.max(playerHeight / 2, y - playerStep)
                break
            case PlayerDirection.Down:
                newY = Math.min(playFieldHeight - playerHeight / 2, y + playerStep)
                break
            default:
                return
        }
        if (newY !== this.position.y) {
            this.position.y = newY
            if (this.onChangePositionY) {
                this.onChangePositionY(this.position.y)
            }
        }
    }
}
