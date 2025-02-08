import {
    ChangeEvent,
    KeyboardEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react'
import {
    BallAnimation,
    PlayerDTO,
    PlayerDTOMap,
    PlayerDirection,
    PlayerTeam,
    TeamsScore,
    teamFromString,
    getElementOrNull,
    GameDataSettings,
    leftTeamX,
    rightTeamX,
    ballRadius,
    ExistingResponse,
    OnPlayingGamesResponse,
    fetchWithAction,
    Message,
    MessageType,
} from '../../utils/interfaces'
import {
    BALL_BASE_SVG_PROPS,
    EXISTING_GAME_REQUESTS_PERIOD,
    LEFT_PLAYER_READY_SVG_PROPS,
    MAX_PLAYFIELD_HEIGHT,
    MAX_PLAYFIELD_WIDTH,
    MIN_PLAYFIELD_HEIGHT,
    MIN_PLAYFIELD_WIDTH,
    MY_PREFIX,
    PLAYFIELD_HEIGHT,
    PLAYFIELD_WIDTH,
    RIGHT_PLAYER_READY_SVG_PROPS,
    START_SETTINGS,
} from '../../utils/const'
import Arena from '../../utils/Arena'
import useSubmit from './useSubmit'
import useStompLogic from './useStompLogic'
import useMessageHandler from './useMessageHandler'
import { enqueueSnackbar } from 'notistack'

interface BallProps extends React.SVGProps<SVGCircleElement> {
    ex: string | number | undefined
    ey: string | number | undefined
    style: React.CSSProperties,
}

export default function usePlayField() {
    const [pendingGameId, setPendingGameId] = useState<string>('')
    const [pendingPlayerId, setPendingPlayerId] = useState<string>('')
    const [pendingTeam, setPendingTeam] = useState<PlayerTeam>(PlayerTeam.LEFT)
    const [token, setToken] = useState<string>('')
    const [teamsScore, setTeamsScore] = useState<TeamsScore | null>(null)
    const [ballAnimation, setBallAnimation] = useState<BallAnimation | null>(null)
    const [playerDTOMap, setPlayerDTOMap] = useState<PlayerDTOMap>({})
    const [teamWinner, setTeamWinner] = useState<PlayerTeam | null>(null)
    const [showGame, setShowGame] = useState<boolean>(false)
    const [openGameSettings, setOpenGameSettings] = useState<boolean>(false)
    const [settingsToSend, setSettingsToSend] = useState<GameDataSettings>(START_SETTINGS)
    const [settings, setSettings] = useState<GameDataSettings>(START_SETTINGS)
    const [connecting, setConnecting] = useState<boolean>(false)
    const [gameExists, setGameExists] = useState<boolean | null>(null)
    const [playerExists, setPlayerExists] = useState<boolean | null>(null)
    const [someExistingGameIds, setSomeExistingGameIds] = useState<string[] | null>(null)
    const [watchersGoalStart, setWatchersGoalStart] = useState<boolean>(false)

    const arenaRef = useRef<Arena>(new Arena())

    const [numLeftPlayers, numRightPlayers]: [number, number] = useMemo(() => {
        let left = 0
        let right = 0

        Object.values(playerDTOMap).forEach((player) => {
            if (player.team === PlayerTeam.LEFT)
                left++
            else
                right++
        })
        return [left, right]
    }, [playerDTOMap])

    // Welcome message
    useEffect(() => {
        enqueueSnackbar('Welcome! Challenge your friends!', { variant: 'info' })
    }, [])

    // Localstorage (store player data)
    const storePlayerData = useCallback(() => {
        localStorage.setItem(MY_PREFIX + 'playerData', JSON.stringify({
            gameId: pendingGameId,
            playerId: pendingPlayerId,
            team: pendingTeam
        }))
    }, [pendingGameId, pendingPlayerId, pendingTeam])

    // Localstorage (retrieve player data)
    useEffect(() => {
        const playerDataStr = localStorage.getItem(MY_PREFIX + 'playerData')
        const playerData = playerDataStr ? JSON.parse(playerDataStr) : null

        if (playerData) {
            setPendingGameId(playerData.gameId)
            setPendingPlayerId(playerData.playerId)
            setPendingTeam(playerData.team)
        }
    }, [])

    const ballProps: BallProps = useMemo(() => {
        const customStyle: React.CSSProperties = {}

        if (teamWinner !== null) {
            const teamWinnerColor = (teamWinner === PlayerTeam.LEFT ? LEFT_PLAYER_READY_SVG_PROPS : RIGHT_PLAYER_READY_SVG_PROPS).fill
            document.documentElement.style.setProperty(
                '--color-winner-team',
                getElementOrNull(teamWinnerColor)
            )
            customStyle.animationName = 'winBallAnimation'
            customStyle.animationTimingFunction = 'ease-in-out'
            customStyle.animationFillMode = 'none'
            customStyle.animationDuration = '0.2s'
            customStyle.animationIterationCount = '10'
        }
        else if (ballAnimation !== null) {
            document.documentElement.style.setProperty('--ball-end-y', `${ballAnimation.endY}px`)
            document.documentElement.style.setProperty('--ball-end-x', `${ballAnimation.endX}px`)
            customStyle.animationName = 'ballAnimation'
            customStyle.animationTimingFunction = 'linear'
            customStyle.animationFillMode = 'forwards'
            customStyle.animationDuration = `${ballAnimation.time}s`
        }
        else {
            customStyle.visibility = 'hidden'
        }
        return {
            style: customStyle,
            ...BALL_BASE_SVG_PROPS,
            r: ballRadius(settings),
            cx: teamWinner !== null ? ballAnimation?.endX : ballAnimation?.startX,
            cy: teamWinner !== null ? ballAnimation?.endY : ballAnimation?.startY,
            ex: ballAnimation?.endX,
            ey: ballAnimation?.endY
        }
    }, [ballAnimation, settings, teamWinner])

    /* Computes winner team only if the ball isn't in the center */
    const maybeSetTeamWinner = useCallback(() => {
        const xBall = Number(document.documentElement.style.getPropertyValue('--ball-end-x').slice(0, -2))
        if (Math.abs(leftTeamX(settings) - xBall) <= ballRadius(settings))
            setTeamWinner(PlayerTeam.RIGHT)
        else if (Math.abs(rightTeamX(settings) - xBall) <= ballRadius(settings))
            setTeamWinner(PlayerTeam.LEFT)
    }, [settings])

    const msgPreAction = useCallback((msgCode: string) => {
        switch (msgCode) {
            case 'GAME_AVAILABLE':
            case 'WATCH_AVAILABLE':
                enqueueSnackbar('Connection established', { variant: 'success' })
                break
        }
    }, [])

    const msgPostAction = useCallback((msg: Message) => {
        const msgCode = msg.code
        switch (msgCode) {
            // Goal animation trigger
            case 'POINT_SCORED':
                maybeSetTeamWinner()
                break
            // The player ID is ok and you can play (to avoid bad rendering on receiving other PlayerDTO)
            case 'GAME_AVAILABLE':
                setShowGame(true)
                enqueueSnackbar('When you are ready, press Enter', { variant: 'info' })
                break
            case 'WATCH_AVAILABLE':
                setShowGame(true)
                break
        }
        setConnecting(false)
        if (msg.type === MessageType.ERROR)
            setTimeout(() => {
                window.location.reload()
            }, 2000)
    }, [maybeSetTeamWinner])

    const {
        gameId,
        playerId,
        team,
        handleButtonClick
    } = useSubmit({
        pendingGameId,
        pendingPlayerId,
        pendingTeam,
        disableEdit: !!token,
        postAction: () => {
            storePlayerData()
            enqueueSnackbar('Connecting...', { variant: 'info' })
            setConnecting(true)
        },
    })

    const handleBallAnimationChange = useCallback((ballAnim: BallAnimation) => {
        setBallAnimation((oldBallAnim) => {
            if (oldBallAnim?.endX === ballAnim.endX && oldBallAnim?.endY === ballAnim.endY) {
                return oldBallAnim
            }
            window.requestAnimationFrame(
                () => setBallAnimation(ballAnim)
            )
            return null
        })
    }, [])

    useEffect(() => {
        arenaRef.current.setSettings(settings)
    }, [settings])

    const handlePlayerDTOChange = useCallback((playerDTO: PlayerDTO) => {
        /* TODO - Step 1
        Set the new value of playerDTOMap
        */
        setPlayerDTOMap((playerDTOMap) => {
            if (playerDTO.team === PlayerTeam.REMOVED) {
                const { [playerDTO.id]: _, ...rest } = playerDTOMap
                return rest
            }
            const updatedPlayerDTOMap = {...playerDTOMap, [playerDTO.id]: playerDTO,}
            const numTeamPlayers = Object.values(updatedPlayerDTOMap).filter((p: PlayerDTO) => {return p.team === playerDTO.team}).length

            arenaRef.current.setNumTeamPlayers(numTeamPlayers)
            if (playerId === playerDTO.id)
                arenaRef.current.setPlayerPosition({ team: playerDTO.team, y: playerDTO.y})

            // For watchers' Goal animations
            if (!playerId && updatedPlayerDTOMap[playerDTO.id]) {
                const prevReadyToStart = playerDTOMap[playerDTO.id]?.readyToStart
                const readyToStart = updatedPlayerDTOMap[playerDTO.id].readyToStart
                setWatchersGoalStart((prevWatchersGoalStart) => {
                    if (!prevWatchersGoalStart && prevReadyToStart && !readyToStart)
                        return true
                    if (prevWatchersGoalStart && prevReadyToStart !== undefined && !prevReadyToStart && readyToStart)
                        return false
                    return prevWatchersGoalStart
                })
            }
            return updatedPlayerDTOMap
        })
    }, [playerId])

    // For watchers' Goal animations
    useEffect(() => {
        if (watchersGoalStart)
            maybeSetTeamWinner()
        else
            setTeamWinner(null)
    }, [watchersGoalStart, settings, maybeSetTeamWinner])

    const {
        handleMessageChange
    } = useMessageHandler(msgPreAction, msgPostAction)

    const {
        sendStart,
        sendAnimationEnded,
        sendPosition,
        sendDisconnect
    } = useStompLogic({
        gameId,
        playerId,
        team,
        settingsToSend,
        playerToken: token,
        onTokenChange: setToken,
        onTeamsScoreChange: setTeamsScore,
        onBallAnimationChange: handleBallAnimationChange,
        onPlayerDTOChange: handlePlayerDTOChange,
        onMessageChange: handleMessageChange,
        onSettingsChange: setSettings
    })

    const handleKeyDown = useCallback(({ key }: KeyboardEvent) => {
        /* TODO - Step 0
        Map the key so that you can:
            - set the moving direction of every player
            - start/stop the game
        */
        /* TODO - Step 1
        Map the key so that you can:
            - set the moving direction of the player
            - request the start of the game
        */
        switch (key) {
            case 'Enter':
                if (playerId) {
                    if (teamWinner !== null)
                        setTeamWinner(null)
                    sendStart(JSON.stringify({playerId, token}))
                }
                break
            case 'ArrowUp':
            case 'w':
                arenaRef.current.getPlayer()?.setDirection(PlayerDirection.Up)
                break
            case 'ArrowDown':
            case 's':
                arenaRef.current.getPlayer()?.setDirection(PlayerDirection.Down)
                break
        }
    }, [sendStart, playerId, token, teamWinner])

    const handleKeyUp = useCallback(({ key }: KeyboardEvent) => {
        /* TODO - Step 0
        Map the key so that you can reset the moving direction
        of the corresponding player.
        Be aware that the user could have already pressed the key
        corresponding to the opposite player direction
        */
        /* TODO - Step 1
        Map the key so that you can reset the moving direction
        of the player.
        Be aware that the user could have already pressed the key
        corresponding to the opposite player direction
        */
        switch (key) {
            case 'ArrowUp':
            case 'w':
                if (arenaRef.current.getPlayer()?.getDirection() === PlayerDirection.Up)
                    arenaRef.current.getPlayer()?.setDirection(PlayerDirection.Hold)
                break
            case 'ArrowDown':
            case 's':
                if (arenaRef.current.getPlayer()?.getDirection() === PlayerDirection.Down)
                    arenaRef.current.getPlayer()?.setDirection(PlayerDirection.Hold)
                break
        }
    }, [])

    // To avoid infinite key pressing when PlayField loses focus (but key is still pressed)
    const handleActiveFocus = useCallback((value: boolean) => {
        if (!value)
            arenaRef.current.getPlayer()?.setDirection(PlayerDirection.Hold)
    }, [])

    const handleAnimationEnd = useCallback(() => {
        /* TODO - Step 1
        Notify the backend that the animation ended
        */
        sendAnimationEnded()
    }, [sendAnimationEnded])

    const handlePlayerPositionYChange = useCallback((playerPositionY: number) => {
        /* TODO - Step 1
        Notify the backend the new player position
        */
        sendPosition(JSON.stringify({playerId, token, y: playerPositionY}))
    }, [sendPosition, playerId, token])

    const handleGameIdChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const newPendingGameId = event.target.value

        setPendingGameId(newPendingGameId)
        if (!newPendingGameId)
            setGameExists(null)
    }, [])

    const handlePlayerIdChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const newPendingPlayerId = event.target.value

        setPendingPlayerId(newPendingPlayerId)
        if (!newPendingPlayerId)
            setPlayerExists(null)
    }, [])

    const handleTeamChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setPendingTeam(teamFromString(event.target.value))
    }, [])

    const handleButtonSettingsClick = useCallback(() => {
        setOpenGameSettings(true)
    }, [])

    const handleCloseGameSettings = useCallback(() => {
        setOpenGameSettings(false)
    }, [])

    const handlePlayFieldWidthSettingChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const newPlayFieldWidth = parseInt(event.target.value) || PLAYFIELD_WIDTH
        if (MIN_PLAYFIELD_WIDTH <= newPlayFieldWidth && newPlayFieldWidth <= MAX_PLAYFIELD_WIDTH)
            setSettingsToSend((settingsToSend) => ({
                ...settingsToSend,
                playFieldWidth: newPlayFieldWidth
            }))
    }, [])

    const handlePlayFieldHeightSettingChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const newPlayFieldHeight = parseInt(event.target.value) || PLAYFIELD_HEIGHT
        if (MIN_PLAYFIELD_HEIGHT <= newPlayFieldHeight && newPlayFieldHeight <= MAX_PLAYFIELD_HEIGHT)
            setSettingsToSend((settingsToSend) => ({
                ...settingsToSend,
                playFieldHeight: newPlayFieldHeight
            }))
    }, [])

    const handlePlayerHeightSettingChange = useCallback((event: Event, newPlayerHeight: number | number[], activeThumb: number) => {
        if (typeof newPlayerHeight == 'number')
            setSettingsToSend((settingsToSend) => ({
                ...settingsToSend,
                playerHeight: newPlayerHeight
            }))
    }, [])

    const handleBallDiameterSettingChange = useCallback((event: Event, newBallDiameter: number | number[], activeThumb: number) => {
        if (typeof newBallDiameter == 'number')
            setSettingsToSend((settingsToSend) => ({
                ...settingsToSend,
                ballDiameter: newBallDiameter
            }))
    }, [])

    const handleBallSpeedSettingChange = useCallback((event: Event, newBallSpeed: number | number[], activeThumb: number) => {
        if (typeof newBallSpeed == 'number')
            setSettingsToSend((settingsToSend) => ({
                ...settingsToSend,
                ballSpeed: newBallSpeed
            }))
    }, [])

    const handlePlayerSpeedSettingChange = useCallback((event: Event, newPlayerSpeed: number | number[], activeThumb: number) => {
        if (typeof newPlayerSpeed == 'number')
            setSettingsToSend((settingsToSend) => ({
                ...settingsToSend,
                playerSpeed: newPlayerSpeed
            }))
    }, [])

    const handleExistingGameIdClick = useCallback((event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
        setPendingGameId(id)
    }, [])

    useEffect(() => {
        arenaRef.current.getPlayer()?.setOnChangePositionY(handlePlayerPositionYChange)
    }, [handlePlayerPositionYChange, teamsScore])

    // QUIT

    const handleQuitClick = useCallback(() => {
        if (playerId)
            sendDisconnect(JSON.stringify({token, playerId}))
        window.location.reload()
    }, [playerId, sendDisconnect, token])

    // To send disconnect request even if player directly closes the page
    const handleBeforeUnload = useCallback(() => {
        if (playerId)
            sendDisconnect(JSON.stringify({token, playerId}))
    }, [playerId, sendDisconnect, token])

    // Before-unload event listener setting
    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [handleBeforeUnload])

    // SEARCH GAME REQUEST

    const fetchGameExists = useCallback(async () => {
        if (pendingGameId) {
            const escapedPendingGameId = encodeURIComponent(pendingGameId)
            const endpoint = `http://localhost/api/public/game/exists/${escapedPendingGameId}`
            fetchWithAction<ExistingResponse>(
                endpoint,
                (result) => setGameExists(result.exists),
                'game existence'
            )
        }
    }, [pendingGameId])

    useEffect(() => {
        fetchGameExists()
    }, [fetchGameExists])

    // ON PLAYING GAMES REQUEST (ONLY AT FIRST)

    const fetchOnPlayingGameIds = useCallback(async () => {
        const endpoint = 'http://localhost/api/public/game/onplaying'
        fetchWithAction<OnPlayingGamesResponse>(
            endpoint,
            (result) => setSomeExistingGameIds(result.gameIds),
            'playing game IDs'
        )
    }, [])

    // The other times every EXISTING_GAME_REQUESTS_PERIOD ms
    useEffect(() => {
        if (numLeftPlayers + numRightPlayers > 0 && showGame)
            return
        fetchOnPlayingGameIds()
        const interval = setInterval(() => {
            fetchOnPlayingGameIds()
        }, EXISTING_GAME_REQUESTS_PERIOD)

        return () => clearInterval(interval)
    }, [fetchOnPlayingGameIds, numLeftPlayers, numRightPlayers, showGame])

    // SEARCH PLAYER REQUEST

    const fetchPlayerExists = useCallback(async () => {
        if (gameExists && pendingGameId && pendingPlayerId) {
            const escapedPendingGameId = encodeURIComponent(pendingGameId)
            const escapedPendingPlayerId = encodeURIComponent(pendingPlayerId)
            const endpoint = `http://localhost/api/public/game/exists/${escapedPendingGameId}/${escapedPendingPlayerId}`
            fetchWithAction<ExistingResponse>(
                endpoint,
                (result) => setPlayerExists(result.exists),
                'player existence'
            )
        }
    }, [gameExists, pendingGameId, pendingPlayerId])

    useEffect(() => {
        fetchPlayerExists()
    }, [fetchPlayerExists])

    // ACTIONS WHEN CLICK ON PARTICULAR DISABLED COMPONENTS

    const handleDisabledComponentClick = useCallback((showWarning: boolean, text: string) => {
        if (showWarning) {
            enqueueSnackbar(text, { variant: 'warning' })
        }
    }, [])

    return {
        gameId: pendingGameId,
        playerId: pendingPlayerId,
        team: pendingTeam,
        teamsScore,
        playerDTOMap,
        ballProps,
        teamWinner,
        numLeftPlayers,
        numRightPlayers,
        showGame,
        openGameSettings,
        settingsToSend,
        settings,
        connecting,
        gameExists,
        playerExists,
        someExistingGameIds,
        handleKeyDown,
        handleKeyUp,
        handleActiveFocus,
        handleAnimationEnd,
        handleGameIdChange,
        handlePlayerIdChange,
        handleTeamChange,
        handleButtonClick,
        handleButtonSettingsClick,
        handleCloseGameSettings,
        handlePlayFieldWidthSettingChange,
        handlePlayFieldHeightSettingChange,
        handlePlayerHeightSettingChange,
        handleBallDiameterSettingChange,
        handleBallSpeedSettingChange,
        handlePlayerSpeedSettingChange,
        handleExistingGameIdClick,
        handleDisabledComponentClick,
        handleQuitClick,
    }
}
