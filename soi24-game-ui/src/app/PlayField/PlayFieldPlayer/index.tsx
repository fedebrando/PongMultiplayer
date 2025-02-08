import { useMemo } from 'react'
import { Typography } from '@mui/joy'
import {
    LEFT_PLAYER_READY_SVG_PROPS,
    PLAYER_BASE_SVG_PROPS,
    PLAYER_NOT_READY_SVG_PROPS,
    PLAYER_TEXT_BASE_STYLE,
    PLAYER_TEXT_LEFT_TEAM_STYLE,
    PLAYER_TEXT_RIGHT_TEAM_STYLE,
    PLAYER_WIDTH,
    RIGHT_PLAYER_READY_SVG_PROPS,
} from '../../utils/const'
import { getElementOrNull, PlayerDTO, PlayerTeam } from '../../utils/interfaces'

interface PlayerProps extends React.SVGProps<SVGRectElement> {
    style: React.CSSProperties,
}

export default function PlayFieldPlayer({
    userId,
    playerId,
    player,
    numTeamPlayers,
    isWinner,
    leftTeamX,
    rightTeamX,
    playerHeight,
    playerRadius,
}: {
    userId?: string,
    playerId: string,
    player: PlayerDTO,
    numTeamPlayers: number,
    isWinner: boolean,
    leftTeamX: number,
    rightTeamX: number,
    playerHeight: number,
    playerRadius: number,
}) {
    const {
        team,
        y: posY,
        readyToStart
    } = player

    const isUser = useMemo(() => (
        userId === playerId
    ), [userId, playerId])

    const playerProps: PlayerProps = useMemo(() => {
        const posX = team === PlayerTeam.LEFT
            ? leftTeamX
            : rightTeamX
        const extraProps = readyToStart
            ? (team === PlayerTeam.LEFT ? LEFT_PLAYER_READY_SVG_PROPS : RIGHT_PLAYER_READY_SVG_PROPS)
            : PLAYER_NOT_READY_SVG_PROPS
        const height = playerHeight / numTeamPlayers
        const customStyle: React.CSSProperties = {}

        if (isWinner) {
            const colorPlayer = (team === PlayerTeam.LEFT ? LEFT_PLAYER_READY_SVG_PROPS : RIGHT_PLAYER_READY_SVG_PROPS).fill
            document.documentElement.style.setProperty(
                '--color-player',
                getElementOrNull(colorPlayer)
            )
            customStyle.animationName = 'winPlayerAnimation'
            customStyle.animationTimingFunction = 'linear'
            customStyle.animationFillMode = 'none'
            customStyle.animationDuration = '0.4s'
            customStyle.animationIterationCount = '5'
        }
        else
            customStyle.zIndex = isUser ? 10 : undefined

        return {
            style: customStyle,
            ...PLAYER_BASE_SVG_PROPS,
            height: height,
            rx: playerRadius,
            ...extraProps,
            x: posX - PLAYER_WIDTH / 2,
            y: posY - height / 2,
        }
    }, [team, leftTeamX, rightTeamX, readyToStart, playerHeight, numTeamPlayers, isWinner, isUser, playerRadius, posY])

    const textSvgProps: React.SVGProps<SVGForeignObjectElement> = useMemo(() => ({
        x: team === PlayerTeam.LEFT
            ? leftTeamX - 2 * PLAYER_WIDTH
            : rightTeamX + 2 * PLAYER_WIDTH,
        textAnchor: team === PlayerTeam.LEFT
            ? 'end'
            : 'start',
        overflow: 'visible',
        /* To fix label Firefox bug (foreignObject must have width and height with positive value) */
        width: 1,
        height: 1
    }), [leftTeamX, rightTeamX, team])

    const textStyle: React.CSSProperties = useMemo(() => {
        const sideStyle = team === PlayerTeam.LEFT
            ? PLAYER_TEXT_LEFT_TEAM_STYLE
            : PLAYER_TEXT_RIGHT_TEAM_STYLE
        return {
            ...PLAYER_TEXT_BASE_STYLE,
            ...sideStyle,
        }
    }, [team])

    return (
        <g>
            <rect
                {...playerProps}
            />
            <foreignObject
                {...textSvgProps}
                y={posY}
            >
                <Typography
                    noWrap
                    level='body3'
                    variant={isUser ? 'solid' : 'soft'}
                    style={textStyle}
                >
                    {playerId}
                </Typography>
            </foreignObject>
        </g>
    )
}
