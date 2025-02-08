import { useCallback, useState } from 'react'
import { PlayerTeam } from 'src/app/utils/interfaces'

export default function useSubmit({
    pendingGameId,
    pendingPlayerId,
    pendingTeam,
    disableEdit,
    postAction,
}: {
    pendingGameId: string,
    pendingPlayerId: string,
    pendingTeam: PlayerTeam,
    disableEdit: boolean,
    postAction?: () => void
}) {
    const [gameId, setGameId] = useState<string>('')
    const [playerId, setPlayerId] = useState<string>('')
    const [team, setTeam] = useState<PlayerTeam>(PlayerTeam.LEFT)

    const handleButtonClick = useCallback(() => {
        if (!disableEdit) {
            setGameId(pendingGameId)
            if (pendingPlayerId) {
                setPlayerId(pendingPlayerId)
            }
            setTeam(pendingTeam)
            if (postAction)
                postAction()
        }
    }, [disableEdit, pendingGameId, pendingPlayerId, pendingTeam, postAction])

    return {
        gameId,
        playerId,
        team,
        handleButtonClick
    }
}
