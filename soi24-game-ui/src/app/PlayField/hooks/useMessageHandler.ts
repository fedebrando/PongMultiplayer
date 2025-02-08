import { useCallback } from 'react'
import { useSnackbar, VariantType } from 'notistack'
import { Message, MessageType } from '../../utils/interfaces'

function mapTypeToVariant(type: MessageType) {
    let variant: VariantType
    switch (type) {
        case MessageType.ERROR:
            variant = 'error'
            break
        case MessageType.WARNING:
            variant = 'warning'
            break
        default:
            variant = 'info'
    }
    return variant
}

function mapCode(code: string) {
    let output: string
    switch (code) {
        case 'GAME_NOT_FOUND':
            output = 'Game not found'
            break
        case 'PLAYER_NOT_FOUND':
            output = 'Player not found'
            break
        case 'PLAYER_ID_ALREADY_USED':
            output = 'Player ID already used. Please, select another one'
            break
        case 'INVALID_PLAYER_TOKEN':
            output = 'Invalid Player token'
            break
        case 'POINT_SCORED':
            output = 'Goal! The game stop'
            break
        // To prevent a player who enters an existing ID for that game from receiving game data after provisional registration
        case 'GAME_AVAILABLE':
            output = 'Move your player with arrows (\u2191, \u2193) or W/S'
            break
        case 'WATCH_AVAILABLE':
            output = 'Enjoy the game!'
            break
        default:
            output = code
    }
    return output
}

export default function useMessageHandler(preAction?: (msgCode: string) => void, postAction?: (msg: Message) => void) {
    const {
        enqueueSnackbar
    } = useSnackbar()

    const handleMessageChange = useCallback((message: Message) => {
        const variant = mapTypeToVariant(message.type)
        const msg = mapCode(message.code)
        if (preAction)
            preAction(message.code)
        enqueueSnackbar(msg, { variant })
        if (postAction)
            postAction(message)
    }, [preAction, enqueueSnackbar, postAction])

    return {
        handleMessageChange
    }
}
