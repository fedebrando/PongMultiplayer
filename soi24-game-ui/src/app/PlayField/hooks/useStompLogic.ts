import { useCallback, useMemo } from 'react'
import useStompClient from '../../stomp/StompClient/hooks/useStompClient'
import {
    BallAnimation,
    GameDataSettings,
    GameMessage,
    Message,
    PlayerDTO,
    PlayerTeam,
    RegisterMessage,
    TeamsScore,
    teamToString,
    WatchMessage
} from '../../utils/interfaces'

const APP_PREFIX = '/app/game.'
const TOPIC_PREFIX = '/topic/game.'

const getDestination = ({
    gameId,
    prefix,
    suffix,
}: {
    gameId: string,
    prefix: string,
    suffix?: string,
}) => (
    gameId !== ''
        ? `${prefix}${gameId}${suffix || ''}`
        : undefined
)

export default function useStompLogic({
    gameId,
    playerId,
    team,
    settingsToSend,
    playerToken,
    onTokenChange,
    onTeamsScoreChange,
    onBallAnimationChange,
    onPlayerDTOChange,
    onMessageChange,
    onSettingsChange,
}: {
    gameId: string,
    playerId: string,
    team: PlayerTeam,
    settingsToSend: GameDataSettings,
    playerToken: string,
    onTokenChange(token: string): void,
    onTeamsScoreChange(teamsScore: TeamsScore): void,
    onBallAnimationChange(ballAnimation: BallAnimation): void,
    onPlayerDTOChange(player: PlayerDTO): void,
    onMessageChange(message: Message): void,
    onSettingsChange(settings: GameDataSettings): void,
}) {

    // WATCH

    const watchDestination = useMemo(() => (
        playerId ? undefined : getDestination({ gameId, prefix: APP_PREFIX })
    ), [gameId, playerId])

    const handleWatchMessage = useCallback(({ body }: { body: string }) => {
        const watchMessage: WatchMessage = JSON.parse(body)
        if (watchMessage.teamsScore) {
            onTeamsScoreChange(watchMessage.teamsScore)
        }
        if (watchMessage.ballAnimation) {
            onBallAnimationChange(watchMessage.ballAnimation)
        }
        if (watchMessage.settings) {
            onSettingsChange(watchMessage.settings)
        }
        if (watchMessage.message) {
            onMessageChange(watchMessage.message)
        }
        watchMessage.players.forEach(onPlayerDTOChange)
    }, [onPlayerDTOChange, onSettingsChange, onTeamsScoreChange, onBallAnimationChange, onMessageChange])

    useStompClient({
        destination: watchDestination,
        onMessage: handleWatchMessage
    })

    // REGISTER

    const registerDestination = useMemo(() => (
        playerId && getDestination({ gameId,
            prefix: APP_PREFIX,
            suffix: `.player.${playerId}.team.${teamToString(team)}.settings.${JSON.stringify(settingsToSend)}`}
        )
    ), [gameId, playerId, settingsToSend, team])

    const handleRegisterMessage = useCallback(({ body }: { body: string }) => {
        const registerMessage: RegisterMessage = JSON.parse(body)
        if (registerMessage.teamsScore) {
            onTeamsScoreChange(registerMessage.teamsScore)
        }
        if (registerMessage.ballAnimation) {
            onBallAnimationChange(registerMessage.ballAnimation)
        }
        if (registerMessage.settings) {
            onSettingsChange(registerMessage.settings)
        }
        if (registerMessage.token) {
            onTokenChange(registerMessage.token)
        }
        if (registerMessage.message) {
            onMessageChange(registerMessage.message)
        }
        registerMessage.players.forEach(onPlayerDTOChange)
    }, [onPlayerDTOChange, onSettingsChange, onTeamsScoreChange, onBallAnimationChange, onTokenChange, onMessageChange])

    useStompClient({
        destination: registerDestination,
        onMessage: handleRegisterMessage
    })

    // MAIN TOPIC

    const mainTopicDestination = useMemo(() => (
        getDestination({ gameId, prefix: TOPIC_PREFIX })
    ), [gameId])

    const handleMainTopicMessage = useCallback(({ body }: { body: string }) => {
        const gameMessage: GameMessage = JSON.parse(body)
        onTeamsScoreChange(gameMessage.teamsScore)
        onBallAnimationChange(gameMessage.ballAnimation)
    }, [onTeamsScoreChange, onBallAnimationChange])

    useStompClient({
        destination: mainTopicDestination,
        onMessage: handleMainTopicMessage
    })

    // BALL TOPIC

    const ballTopicDestination = useMemo(() => (
        getDestination({ gameId, prefix: TOPIC_PREFIX, suffix: '.ball' })
    ), [gameId])

    const handleBallTopicMessage = useCallback(({ body }: { body: string }) => {
        const ballAnimation: BallAnimation = JSON.parse(body)
        onBallAnimationChange(ballAnimation)
    }, [onBallAnimationChange])

    useStompClient({
        destination: ballTopicDestination,
        onMessage: handleBallTopicMessage
    })

    // PLAYERS TOPIC

    const playersTopicDestination = useMemo(() => (
        getDestination({ gameId, prefix: TOPIC_PREFIX, suffix: '.players' })
    ), [gameId])

    const handlePlayersTopicMessage = useCallback(({ body }: { body: string }) => {
        const playerDTO: PlayerDTO = JSON.parse(body)
        onPlayerDTOChange(playerDTO)
    }, [onPlayerDTOChange])

    useStompClient({
        destination: playersTopicDestination,
        onMessage: handlePlayersTopicMessage
    })

    // MESSAGE TOPIC

    const messageTopicDestination = useMemo(() => (
        playerToken && getDestination({ gameId, prefix: TOPIC_PREFIX, suffix: `.messages.${playerToken}` })
    ), [gameId, playerToken])

    /* TODO - Step 2
    Handle Message topic messages
    */
    const handleMessageTopicMessage = useCallback(({ body }: { body: string }) => {
        const msg: Message = JSON.parse(body)
        onMessageChange(msg)
    }, [onMessageChange])

    useStompClient({
        destination: messageTopicDestination,
        onMessage: handleMessageTopicMessage
    })

    // SEND START

    const startDestination = useMemo(() => (
        getDestination({ gameId, prefix: APP_PREFIX, suffix: '.start' })
    ), [gameId])

    const {
        send: sendStart
    } = useStompClient({ destination: startDestination })

    // SEND ANIMATION ENDED

    const animationEndedDestination = useMemo(() => (
        getDestination({ gameId, prefix: APP_PREFIX, suffix: '.animation' })
    ), [gameId])

    const {
        send: sendAnimationEnded
    } = useStompClient({ destination: animationEndedDestination })

    // SEND POSITION

    const positionDestination = useMemo(() => (
        getDestination({ gameId, prefix: APP_PREFIX, suffix: '.position' })
    ), [gameId])

    const {
        send: sendPosition
    } = useStompClient({ destination: positionDestination })

    // SEND DISCONNECT

    const disconnectDestination = useMemo(() => (
        getDestination({ gameId, prefix: APP_PREFIX, suffix: '.disconnect' })
    ), [gameId])

    const {
        send: sendDisconnect
    } = useStompClient({ destination: disconnectDestination })

    return {
        sendStart,
        sendAnimationEnded,
        sendPosition,
        sendDisconnect
    }
}
