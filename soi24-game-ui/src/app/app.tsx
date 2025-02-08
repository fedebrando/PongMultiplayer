import { SnackbarProvider } from 'notistack'
import '@fontsource/public-sans'
import {
    CssVarsProvider,
    Stack,
    Typography
} from '@mui/joy'
import StompProvider from './stomp/StompProvider'
import theme from './theme'
import PlayField from './PlayField'
import { TITLE_STYLE } from './utils/const'

export default function App() {
    return (
        <StompProvider>
            <SnackbarProvider preventDuplicate>
                <CssVarsProvider theme={theme}>
                    <Stack
                        spacing={2}
                        alignItems='center'
                        justifyContent='center'
                    >
                        <Typography
                            noWrap
                            level='display1'
                            variant='soft'
                            sx={TITLE_STYLE}
                        >
                            Brando.<i>io</i>
                        </Typography>
                        <PlayField />
                    </Stack>
                </CssVarsProvider>
            </SnackbarProvider>
        </StompProvider>
    )
}
