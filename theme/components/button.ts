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
      border: '2px dashed white',
      color: 'white',
      _active: {
        bg: 'transparent',
        border: '2px dashed white',
      },
      _hover: {
        bg: 'transparent',
        border: '2px solid white',
      },
    },
    solid: {
      color: 'white',
      border: '2px dashed white',
      _hover: {
        bg: 'transparent',
        border: '2px solid white',
      },
      _active: {
        bg: 'transparent',
        border: '2px solid white',
      },
    },
    ghost: {
      bg: 'transparent',
      border: '2px dashed transparent',
      _hover: {
        bg: 'transparent',
        border: '2px dashed white',
      },
      _active: {
        bg: 'transparent',
        border: '2px solid white',
      },
    }
  },
  defaultProps: {
    size: 'md',
    variant: 'solid',
  },
})

export default Button