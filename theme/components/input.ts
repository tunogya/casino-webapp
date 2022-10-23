import { defineStyleConfig } from '@chakra-ui/react'

const Input = defineStyleConfig({
  baseStyle: {
  },
  variants: {
    outline: {
      field: {
        border: '0.5px solid',
        borderColor: 'yellow.900',
        fontFamily: 'Syncopate',
        fontSize: 'sm',
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
        fontFamily: 'Syncopate',
        fontSize: 'sm',
      }
    }
  }
})

export default Input