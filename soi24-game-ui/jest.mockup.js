import { TextDecoder, TextEncoder } from 'util'
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        // Per la compatibilità con vecchie versioni di browser
        addListener: jest.fn(),
        // Per la compatibilità con vecchie versioni di browser
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
