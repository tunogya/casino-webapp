import { defineStyleConfig } from '@chakra-ui/react'

const Input = defineStyleConfig({
  baseStyle: {
  },
  variants: {
    outline: {
      field: {
        border: '0.5px solid',
        borderColor: 'yellow.900',
        _focus: {
          border: '2px solid',
          bg: 'white',
          boxShadow: 'none',
        },
        _hover: null,
      },
    },
    filled: {
      field: {
        bg: 'yellow.900',
        color: 'white',
      }
    },
    flushed: {
      field: {
        fontFamily: 'Readex Pro',
        bg: 'transparent',
        color: 'white'
      }
    }
  }
})

export default Input