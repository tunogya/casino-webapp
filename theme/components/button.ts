import { defineStyleConfig } from '@chakra-ui/react'

const Button = defineStyleConfig({
  baseStyle: {
    fontWeight: 700,
    borderRadius: '0',
    fontFamily: 'Readex Pro',
    minH: '44px',
  },
  variants: {
    outline: {
      border: '1px dashed white',
      color: 'white',
      _active: {
        bg: 'transparent',
        border: '1px dashed white',
      },
      _hover: {
        bg: 'transparent',
      },
    },
    solid: {
      color: 'black',
      border: '1px dashed white',
      _hover: {
        bg: 'transparent',
        color: 'white',
      },
      _active: {
        bg: 'transparent',
        border: '1px solid white',
      },
    },
    ghost: {
      bg: 'transparent',
      color: 'white',
      _hover: {
        bg: 'transparent',
      },
      _active: {
        bg: 'transparent',
      },
    }
  },
  defaultProps: {
    size: 'md',
    variant: 'solid',
  },
})

export default Button