import { Fragment, useEffect, useRef } from 'react'
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    FormHelperText,
    FormLabel,
    IconButton,
    Input,
    List,
    ListItemButton,
    Modal,
    ModalClose,
    ModalDialog,
    Radio,
    RadioGroup,
    Slider,
    Stack,
    Tooltip,
    Typography
} from '@mui/joy'
import {
    PLAYFIELD_STYLE,
    PLAYFIELD_TEXT_STYLE,
    LASER_BEAM_SVG_PROPS,
    INPUT_BOX_STYLE,
    MIN_PLAYFIELD_WIDTH,
    MAX_PLAYFIELD_WIDTH,
    MIN_PLAYFIELD_HEIGHT,
    MAX_PLAYFIELD_HEIGHT,
    MIN_PLAYER_HEIGHT,
    MAX_PLAYER_HEIGHT,
    MIN_BALL_DIAMETER,
    MAX_BALL_DIAMETER,
    MIN_BALL_SPEED,
    MAX_BALL_SPEED,
    MIN_PLAYER_SPEED,
    MAX_PLAYER_SPEED,
    STANDARD_SLIDER_STYLE,
    PLAYER_HEIGHT_SLIDER_STYLE,
    EXISTING_GAMES_BOX_STYLE,
    LABEL_EXISTING_GAMES_BOX_STYLE,
    LABEL_INPUT_BOX_STYLE,
    AVATAR_GAME_STYLE,
    SETTINGS_ICON_STYLE,
    MODAL_DIALOG_SETTINGS,
    STEP_PLAYFIELD_WIDTH,
    STEP_PLAYFIELD_HEIGHT,
    STEP_PLAYER_HEIGHT,
    STEP_BALL_DIAMETER,
    STEP_BALL_SPEED,
    STEP_PLAYER_SPEED,
    HELPER_TEXT_ERROR,
    HELPER_TEXT_SUCCESS,
    LEFT_TEAM_COLOR,
    RIGHT_TEAM_COLOR,
    EXISTING_GAME_ITEM_STYLE,
    TOOLTIP_STYLE,
    SETTINGS_BUTTON_STYLE,
    COLOR_TEXT_GAME_ID,
} from '../utils/const'
import usePlayField from './hooks/usePlayField'
import PlayFieldPlayer from './PlayFieldPlayer'
import { leftTeamX, playerRadius, PlayerTeam, rightTeamX, teamToString } from '../utils/interfaces'
import settingsIcon from '../../../img/settings.svg'
import gameIcon from '../../../img/game.svg'
import PulsatingBadge from 'src/components/PulsatingBadge'

export default function PlayField() {

    const {
        gameId,
        playerId,
        team,
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
    } = usePlayField()

    const playFieldRef = useRef<SVGSVGElement | null>(null)

    useEffect(() => {
        if (playFieldRef.current)
            playFieldRef.current.focus()
    }, [numLeftPlayers, numRightPlayers])

    return (
        <Fragment>
            {(numLeftPlayers + numRightPlayers > 0 && showGame) && (
                <Stack spacing={1}>
                    <div style={PLAYFIELD_STYLE}>
                        {teamsScore && teamWinner === null && (
                            <Typography level='h1' style={PLAYFIELD_TEXT_STYLE}>
                                <span style={{ color: LEFT_TEAM_COLOR }}>{teamsScore.leftTeamScore}</span>
                                -
                                <span style={{ color: RIGHT_TEAM_COLOR }}>{teamsScore.rightTeamScore}</span>
                            </Typography>
                        )}
                        {teamWinner !== null && (
                            <Typography level='h1' className='goalBanner' style={{
                                ...PLAYFIELD_TEXT_STYLE,
                                color: teamWinner === PlayerTeam.LEFT ? LEFT_TEAM_COLOR : RIGHT_TEAM_COLOR
                            }}>
                                GOOOOOOL!
                            </Typography>
                        )}
                        <svg
                            tabIndex={0}
                            ref={playFieldRef}
                            overflow='visible'
                            viewBox={`0 0 ${settings.playFieldWidth} ${settings.playFieldHeight}`}
                            width={`${settings.playFieldWidth / 10}vmin`}
                            height={`${settings.playFieldHeight / 10}vmin`}
                            onKeyDown={handleKeyDown}
                            onKeyUp={handleKeyUp}
                            onFocus={() => handleActiveFocus(true)}
                            onBlur={() => handleActiveFocus(false)}
                        >
                            <defs>
                                <clipPath id='clip-text'>
                                    <rect
                                        x='0'
                                        y='0'
                                        width={settings.playFieldWidth}
                                        height={settings.playFieldHeight}
                                    />
                                </clipPath>
                            </defs>
                            <text
                                x='50%'
                                y='50%'
                                fill={COLOR_TEXT_GAME_ID}
                                fontSize='10rem'
                                textAnchor='middle'
                                dominantBaseline='middle'
                                clipPath='url(#clip-text)'
                            >
                                {gameId}
                            </text>
                            {teamWinner === null && (
                                <line
                                    {...LASER_BEAM_SVG_PROPS}
                                    x1={ballProps.cx}
                                    y1={ballProps.cy}
                                    x2={ballProps.ex}
                                    y2={ballProps.ey}
                                />
                            )}
                            <circle
                                {...ballProps}
                                onAnimationEnd={handleAnimationEnd}
                            />
                            {Object.entries(playerDTOMap).map(([playerDTOId, playerDTO]) => (
                                <PlayFieldPlayer
                                    key={playerDTOId}
                                    userId={playerId}
                                    playerId={playerDTOId}
                                    player={playerDTOMap[playerDTOId]}
                                    numTeamPlayers={playerDTO.team === PlayerTeam.LEFT ? numLeftPlayers : numRightPlayers}
                                    isWinner={teamWinner === playerDTO.team}
                                    leftTeamX={leftTeamX(settings)}
                                    rightTeamX={rightTeamX(settings)}
                                    playerHeight={settings.playerHeight}
                                    playerRadius={playerRadius(settings)}
                                />
                            ))}
                        </svg>
                    </div>
                    <Button
                        size='sm'
                        color='danger'
                        onClick={handleQuitClick}
                    >
                        Quit
                    </Button>
                </Stack>
            )}
            {(numLeftPlayers + numRightPlayers === 0 || !showGame) && (
                <Stack
                    direction='row'
                    spacing={0}
                >
                    <Box sx={INPUT_BOX_STYLE}>
                        <Stack
                            direction='column'
                            spacing={4}
                        >
                            <Stack>
                                <FormLabel sx={LABEL_INPUT_BOX_STYLE}>Game ID</FormLabel>
                                <Stack direction='row' spacing={1}>
                                    <Input
                                        size='sm'
                                        variant='soft'
                                        placeholder='Game ID'
                                        value={gameId}
                                        onChange={handleGameIdChange}
                                        disabled={connecting}
                                    />
                                    <div onClick={() => handleDisabledComponentClick(
                                        !connecting && !!gameExists,
                                        'You can\'t choose settings for an existing game'
                                    )}>
                                        <Tooltip title='Settings' sx={TOOLTIP_STYLE}>
                                            <IconButton
                                                variant='outlined'
                                                onClick={handleButtonSettingsClick}
                                                disabled={connecting || !!gameExists}
                                                sx={SETTINGS_BUTTON_STYLE}
                                            >
                                                <img
                                                    src={settingsIcon}
                                                    alt='settings'
                                                    style={SETTINGS_ICON_STYLE}
                                                    className='rotate-icon'
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                    <Modal open={openGameSettings} onClose={handleCloseGameSettings}>
                                        <ModalDialog sx={MODAL_DIALOG_SETTINGS}>
                                            <ModalClose />
                                            <Stack
                                                direction='column'
                                                spacing={4}
                                            >
                                                <Stack>
                                                    <FormLabel>Playfield Width</FormLabel>
                                                    <Input
                                                        type='number'
                                                        value={settingsToSend.playFieldWidth}
                                                        onChange={handlePlayFieldWidthSettingChange}
                                                        slotProps={{
                                                            input: {
                                                                min: MIN_PLAYFIELD_WIDTH,
                                                                step: STEP_PLAYFIELD_WIDTH,
                                                                max: MAX_PLAYFIELD_WIDTH
                                                            },
                                                        }}
                                                    />
                                                </Stack>
                                                <Stack>
                                                    <FormLabel>Playfield Height</FormLabel>
                                                    <Input
                                                        type='number'
                                                        value={settingsToSend.playFieldHeight}
                                                        onChange={handlePlayFieldHeightSettingChange}
                                                        slotProps={{
                                                            input: {
                                                                min: MIN_PLAYFIELD_HEIGHT,
                                                                step: STEP_PLAYFIELD_HEIGHT,
                                                                max: MAX_PLAYFIELD_HEIGHT
                                                            },
                                                        }}
                                                    />
                                                </Stack>
                                                <Stack>
                                                    <FormLabel>Player Height</FormLabel>
                                                    <Slider
                                                        value={settingsToSend.playerHeight}
                                                        onChange={handlePlayerHeightSettingChange}
                                                        min={MIN_PLAYER_HEIGHT}
                                                        step={STEP_PLAYER_HEIGHT}
                                                        max={MAX_PLAYER_HEIGHT}
                                                        sx={{
                                                            ...PLAYER_HEIGHT_SLIDER_STYLE,
                                                            '--Slider-thumbSize': `${settingsToSend.playerHeight/16}rem`
                                                        }}
                                                        valueLabelDisplay='auto'
                                                        color='info'
                                                    />
                                                </Stack>
                                                <Stack>
                                                    <FormLabel>Ball Diameter</FormLabel>
                                                    <Slider
                                                        value={settingsToSend.ballDiameter}
                                                        onChange={handleBallDiameterSettingChange}
                                                        min={MIN_BALL_DIAMETER}
                                                        step={STEP_BALL_DIAMETER}
                                                        max={MAX_BALL_DIAMETER}
                                                        sx={{
                                                            '--Slider-thumbSize': `${settingsToSend.ballDiameter/16}rem`
                                                        }}
                                                        valueLabelDisplay='auto'
                                                        color='info'
                                                    />
                                                </Stack>
                                                <Stack>
                                                    <FormLabel>Ball Speed</FormLabel>
                                                    <Slider
                                                        value={settingsToSend.ballSpeed}
                                                        onChange={handleBallSpeedSettingChange}
                                                        min={MIN_BALL_SPEED}
                                                        step={STEP_BALL_SPEED}
                                                        max={MAX_BALL_SPEED}
                                                        marks={[
                                                            {value: MIN_BALL_SPEED, label: 'Slow'},
                                                            {value: Math.floor((MIN_BALL_SPEED + MAX_BALL_SPEED) / 2), label: 'Medium'},
                                                            {value: MAX_BALL_SPEED, label: 'Fast'}
                                                        ]}
                                                        sx={STANDARD_SLIDER_STYLE}
                                                        valueLabelDisplay='auto'
                                                    />
                                                </Stack>
                                                <Stack>
                                                    <FormLabel>Player Speed</FormLabel>
                                                    <Slider
                                                        value={settingsToSend.playerSpeed}
                                                        onChange={handlePlayerSpeedSettingChange}
                                                        min={MIN_PLAYER_SPEED}
                                                        step={STEP_PLAYER_SPEED}
                                                        max={MAX_PLAYER_SPEED}
                                                        marks={[
                                                            {value: MIN_PLAYER_SPEED, label: 'Slow'},
                                                            {value: Math.floor((MIN_PLAYER_SPEED + MAX_PLAYER_SPEED) / 2), label: 'Medium'},
                                                            {value: MAX_PLAYER_SPEED, label: 'Fast'}
                                                        ]}
                                                        sx={STANDARD_SLIDER_STYLE}
                                                        valueLabelDisplay='auto'
                                                    />
                                                </Stack>
                                            </Stack>
                                        </ModalDialog>
                                    </Modal>
                                </Stack>
                                {gameExists !== null && (
                                    <FormHelperText>
                                        {gameExists ? 'Existing game' : 'New game'}
                                    </FormHelperText>
                                )}
                            </Stack>

                            <Stack>
                                <FormLabel sx={LABEL_INPUT_BOX_STYLE}>Player ID</FormLabel>
                                <Input
                                    size='sm'
                                    variant='soft'
                                    placeholder='Player ID'
                                    value={playerId}
                                    onChange={handlePlayerIdChange}
                                    disabled={connecting}
                                    error={!!playerExists}
                                />
                                {playerExists !== null && gameExists && (
                                    <FormHelperText sx={playerExists ? HELPER_TEXT_ERROR : HELPER_TEXT_SUCCESS}>
                                        {playerExists ? 'This player already exists' : 'Ok'}
                                    </FormHelperText>
                                )}
                            </Stack>

                            <Stack>
                                <FormLabel sx={LABEL_INPUT_BOX_STYLE}>Team</FormLabel>
                                <RadioGroup
                                    value={teamToString(team)}
                                    color='primary'
                                    name='rbg-team'
                                    onChange={handleTeamChange}
                                    orientation='vertical'
                                    onClick={() => handleDisabledComponentClick(
                                        !connecting && !playerId,
                                        'First, enter the player ID'
                                    )}
                                >
                                    <Radio value={teamToString(PlayerTeam.LEFT)}
                                        label='Left'
                                        color='primary'
                                        size='sm'
                                        variant='solid'
                                        sx={LABEL_INPUT_BOX_STYLE}
                                        disabled={connecting || !playerId}
                                    />
                                    <Radio value={teamToString(PlayerTeam.RIGHT)}
                                        label='Right'
                                        color='primary'
                                        size='sm'
                                        variant='solid'
                                        sx={LABEL_INPUT_BOX_STYLE}
                                        disabled={connecting || !playerId}
                                    />
                                </RadioGroup>
                            </Stack>
                            <div onClick={() => handleDisabledComponentClick(
                                !connecting && !gameId,
                                'First, enter the Game ID'
                            )}>
                                <Button
                                    size='sm'
                                    onClick={handleButtonClick}
                                    disabled={!gameId}
                                    loading={connecting}
                                    sx={{width: '100%'}}
                                >
                                    {playerId ? (gameExists ? 'Enter' : 'Create') : 'Watch'}
                                </Button>
                            </div>
                        </Stack>
                    </Box>
                    <Box sx={EXISTING_GAMES_BOX_STYLE}>
                        <Stack direction='column' spacing={2} alignSelf='center'>
                            <Stack direction='row' spacing={2} alignItems='center'>
                                <FormLabel sx={LABEL_INPUT_BOX_STYLE}>
                                    {'Online games'}
                                </FormLabel>
                                <PulsatingBadge />
                            </Stack>
                            {someExistingGameIds === null && (
                                <CircularProgress
                                    size='md'
                                    sx={{alignSelf: 'center'}}
                                />
                            )}
                            {someExistingGameIds !== null && someExistingGameIds.length > 0 &&
                                <List sx={{overflow: 'auto'}}>
                                    {someExistingGameIds.map((id: string) => (
                                        <ListItemButton
                                            key={id}
                                            onClick={(event) => handleExistingGameIdClick(event, id)}
                                            sx={EXISTING_GAME_ITEM_STYLE}
                                        >
                                            <Stack direction='row' spacing={2} alignItems='center'>
                                                <Avatar src={gameIcon} sx={AVATAR_GAME_STYLE}/>
                                                <FormLabel sx={LABEL_EXISTING_GAMES_BOX_STYLE}>
                                                    {id}
                                                </FormLabel>
                                            </Stack>
                                        </ListItemButton>
                                    ))}
                                </List>
                            }
                            {someExistingGameIds !== null && someExistingGameIds.length === 0 &&
                                <FormHelperText>
                                    There are no online games,<br/>create your own!
                                </FormHelperText>
                            }
                        </Stack>
                    </Box>
                </Stack>
            )}
        </Fragment>
    )
}
