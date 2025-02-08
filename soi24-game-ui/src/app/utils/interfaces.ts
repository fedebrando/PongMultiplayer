import { FPS, PLAYER_WIDTH } from './const'

export interface StompClient {
    publish(params: { destination: string, body?: string }): void,
    subscribe(destination: string, callback: (msg: { body: string }) => void): void,
    unsubscribe(destination: string): void,
}

export interface BallAnimation {
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    time: number,
}

export enum PlayerTeam {
    LEFT,
    RIGHT,
    REMOVED
}

export function teamToString(team: PlayerTeam): string {
    return team === PlayerTeam.LEFT ? 'left' : 'right'
}

export function teamFromString(teamStr: string): PlayerTeam {
    return teamStr === 'left' ? PlayerTeam.LEFT : PlayerTeam.RIGHT
}

export interface PlayerPosition {
    team: PlayerTeam,
    y: number,
}

export enum PlayerDirection {
    Hold,
    Up,
    Down,
}

export interface PlayerDTO extends PlayerPosition {
    id: string,
    readyToStart: boolean,
}

export type PlayerDTOMap = Record<string, PlayerDTO>

export interface TeamsScore {
    leftTeamScore: number,
    rightTeamScore: number,
}

export enum MessageType {
    ERROR,
    WARNING,
    INFO,
}

export interface Message {
    type: MessageType,
    code: string,
}

export interface ExistingResponse {
    exists: boolean
}

export interface OnPlayingGamesResponse {
    gameIds: string[]
}

export interface GameMessage {
    teamsScore: TeamsScore,
    ballAnimation: BallAnimation,
}

export interface WatchMessage extends Partial<GameMessage> {
    players: PlayerDTO[],
    message?: Message,
    settings?: GameDataSettings,
}

export interface RegisterMessage extends WatchMessage {
    token?: string,
}

export interface GameDataSettings {
    playFieldWidth: number,
    playFieldHeight: number,
    playerHeight: number,
    ballDiameter: number,
    ballSpeed: number,
    playerSpeed: number,
}

export function leftTeamX(settings: GameDataSettings): number {
    return Math.floor(settings.playFieldWidth / 20)
}

export function rightTeamX(settings: GameDataSettings): number {
    return settings.playFieldWidth - leftTeamX(settings)
}

export function ballRadius(settings: GameDataSettings): number {
    return Math.floor(settings.ballDiameter / 2)
}

export function playerStep(settings: GameDataSettings): number {
    return Math.floor(settings.playerSpeed / FPS)
}

export function playerRadius(settings: GameDataSettings): number {
    return Math.floor(Math.min(PLAYER_WIDTH, settings.playerHeight) / 2)
}

export function getElementOrNull<T>(element: T): NonNullable<T> | null {
    return (element !== undefined ? element : null)
}

export async function fetchWithAction<T>(endpoint: string, fetchAction: (result: T) => void, fetchNameError: string) {
    try {
        const response = await fetch(endpoint)
        if (!response.ok)
            throw new Error(`HTTP Error! Status: ${response.status}`)
        const result: T = await response.json()
        fetchAction(result)
    } catch (err) {
        console.error(`Error on fetching ${fetchNameError}:`, err)
    }
}
