import { defineStyleConfig } from '@chakra-ui/react'

const Button = defineStyleConfig({
  baseStyle: {
    fontWeight: 700,
    borderRadius: '12px',
    fontFamily: 'Syncopate',
    minH: '44px',
  },
  variants: {
    outline: {
      border: '2px solid',
      borderColor: 'yellow.900',
      bg: "white",
      color: "yellow.900",
      _active: null,
      _hover: null,
    },
    solid: {
      bg: 'red.400',
      color: 'white',
      border: '2px solid',
      borderColor: 'yellow.900',
      _hover: null,
      _active: null,
    },
  },
  defaultProps: {
    size: 'md',
    variant: 'solid',
  },
})

export default Button