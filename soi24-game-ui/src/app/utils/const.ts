import { SxProps } from '@mui/joy/styles/types'
import React, { CSSProperties } from 'react'
import { GameDataSettings } from './interfaces'

// TITLE STYLE

export const TITLE_STYLE: SxProps = Object.freeze({
    backgroundColor: 'black',
    color: 'yellow'
})

// MY PREFIX

export const MY_PREFIX = 'unipr-stud-02-'

// EXISTING GAME REQUESTS PERIOD (ms)

export const EXISTING_GAME_REQUESTS_PERIOD = 10000

// GAME DATA

export const PLAYFIELD_WIDTH = 1000
export const PLAYFIELD_HEIGHT = 750

export const FPS = 60
// ms between frames
export const MS_PER_FRAME = 1000 / FPS

export const BALL_DIAMETER = 20
export const BALL_RADIUS = BALL_DIAMETER / 2
// unit per sec
export const BALL_SPEED = PLAYFIELD_WIDTH / 2

export const PLAYER_WIDTH = 10
export const PLAYER_HEIGHT = 100
export const PLAYER_RADIUS = Math.min(PLAYER_WIDTH, PLAYER_HEIGHT) / 2
// unit per sec
export const PLAYER_SPEED = PLAYFIELD_HEIGHT / 3
// unit per frame
export const PLAYER_STEP = Math.floor(PLAYER_SPEED / FPS)

export const LEFT_TEAM_X = Math.floor(PLAYFIELD_WIDTH / 20)
export const RIGHT_TEAM_X = Math.floor(PLAYFIELD_WIDTH - LEFT_TEAM_X)

// SETTINGS CLIENT CHECK

export const MIN_PLAYFIELD_WIDTH = 200
export const MAX_PLAYFIELD_WIDTH = 2000
export const STEP_PLAYFIELD_WIDTH = 10

export const MIN_PLAYFIELD_HEIGHT = 200
export const MAX_PLAYFIELD_HEIGHT = 800
export const STEP_PLAYFIELD_HEIGHT = 10

export const MIN_PLAYER_HEIGHT = 30
export const MAX_PLAYER_HEIGHT = 170
export const STEP_PLAYER_HEIGHT = 10

export const MIN_BALL_DIAMETER = 10
export const MAX_BALL_DIAMETER = 50
export const STEP_BALL_DIAMETER = 5

export const MIN_BALL_SPEED = 200
export const MAX_BALL_SPEED = 1000
export const STEP_BALL_SPEED = 100

export const MIN_PLAYER_SPEED = 100
export const MAX_PLAYER_SPEED = 500
export const STEP_PLAYER_SPEED = 50

// START SETTINGS

export const START_SETTINGS: GameDataSettings = {
    playFieldWidth: PLAYFIELD_WIDTH,
    playFieldHeight: PLAYFIELD_HEIGHT,
    playerHeight: PLAYER_HEIGHT,
    ballDiameter: BALL_DIAMETER,
    ballSpeed: BALL_SPEED,
    playerSpeed: PLAYER_SPEED,
}

// INPUT BOX STYLE

export const INPUT_BOX_STYLE: SxProps = Object.freeze({
    backgroundColor: '#0C0E1D',
    p: 10,
})

export const LABEL_INPUT_BOX_STYLE: SxProps = Object.freeze({
    color: '#FFF8E7',
})

// EXISTING GAMES BOX STYLE

export const EXISTING_GAMES_BOX_STYLE: SxProps = Object.freeze({
    backgroundColor: '#000000',
    p: 3,
})

export const LABEL_EXISTING_GAMES_BOX_STYLE: SxProps = Object.freeze({
    color: '#00FF00',
})

export const AVATAR_GAME_STYLE: SxProps = Object.freeze({
    '--Avatar-size': '1.875rem',
})

export const EXISTING_GAME_ITEM_STYLE: SxProps = Object.freeze({
    '&:hover': {
        backgroundColor: '#1A1A1A',
    },
})

// FORM HELPER TEXT STYLES

export const HELPER_TEXT_ERROR: SxProps = Object.freeze({
    color: '#FF0000'
})

export const HELPER_TEXT_SUCCESS: SxProps = Object.freeze({
    color: '#00FF00'
})

// SETTINGS PANEL STYLE

export const SETTINGS_ICON_STYLE: React.CSSProperties = Object.freeze({
    width: '1.7em',
    height: '1.7em',
    transition: 'transform 0.5s ease-in-out',
})

export const STANDARD_SLIDER_STYLE: SxProps = Object.freeze({
    '--Slider-thumbSize': '1.375rem',
    '--Slider-thumbWidth': '0.5625rem',
    '--Slider-markSize': '0.125rem'
})

export const PLAYER_HEIGHT_SLIDER_STYLE: SxProps = Object.freeze({
    '--Slider-thumbWidth': `${PLAYER_WIDTH / 16}rem`
})

export const MODAL_DIALOG_SETTINGS: SxProps = Object.freeze({
    overflow: 'auto',
    width: '10rem',
    p: 5,
})

// SETTINGS BUTTON STYLE

export const SETTINGS_BUTTON_STYLE: SxProps = Object.freeze({
    backgroundColor: 'none',
    '&:hover': {
        backgroundColor: 'blue'
    },
    '&:hover .rotate-icon': {
        transform: 'rotate(360deg)',
        transition: 'transform 0.5s ease-in-out'
    },
})

// TOOLTIP STYLE

export const TOOLTIP_STYLE: SxProps = Object.freeze({
    backgroundColor: 'blue'
})

// PLAYFIELD STYLE

export const PLAYFIELD_SVG_VIEWBOX = `0 0 ${PLAYFIELD_WIDTH} ${PLAYFIELD_HEIGHT}`
export const PLAYFIELD_SVG_WIDTH = '100vmin'
export const PLAYFIELD_SVG_HEIGHT = '75vmin'

export const PLAYFIELD_STYLE: CSSProperties = Object.freeze({
    position: 'relative',
    backgroundColor: '#0C0E1D'
})

export const PLAYFIELD_TEXT_STYLE: CSSProperties = Object.freeze({
    position: 'absolute',
    transform: 'translate(-50%, 0%)',
    left: '50%',
    color: 'white'
})

export const COLOR_TEXT_GAME_ID = '#171A36'

// BALL STYLE

export const BALL_BASE_SVG_PROPS: React.SVGProps<SVGCircleElement> = Object.freeze({
    fill: '#FFF8E7',
    r: BALL_RADIUS,
})

export const LASER_BEAM_SVG_PROPS: React.SVGProps<SVGLineElement> = Object.freeze({
    stroke: '#FFF8E7',
    strokeWidth: 1,
})

// TEAM COLORS

export const LEFT_TEAM_COLOR = '#0000FF'
export const RIGHT_TEAM_COLOR = '#FF0000'

// PLAYER STYLE

export const PLAYER_BASE_SVG_PROPS: React.SVGProps<SVGRectElement> = Object.freeze({
    rx: PLAYER_RADIUS,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
})
export const LEFT_PLAYER_READY_SVG_PROPS: React.SVGProps<SVGRectElement> = Object.freeze({
    fill: LEFT_TEAM_COLOR,
})
export const RIGHT_PLAYER_READY_SVG_PROPS: React.SVGProps<SVGRectElement> = Object.freeze({
    fill: RIGHT_TEAM_COLOR,
})
export const PLAYER_NOT_READY_SVG_PROPS: React.SVGProps<SVGRectElement> = Object.freeze({
    fill: '#BFBFBF',
})

export const PLAYER_TEXT_BASE_STYLE: CSSProperties = Object.freeze({
    width: 'fit-content',
    margin: 0,
})
export const PLAYER_TEXT_LEFT_TEAM_STYLE: CSSProperties = Object.freeze({
    transform: 'translate(-100%, -50%)',
})
export const PLAYER_TEXT_RIGHT_TEAM_STYLE: CSSProperties = Object.freeze({
    transform: 'translate(0%, -50%)',
})
