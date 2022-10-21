import { defineStyleConfig } from '@chakra-ui/react'

const Button = defineStyleConfig({
  baseStyle: {
    fontWeight: 700,
    borderRadius: '12px',
  },
  variants: {
    outline: {
      border: '2px solid',
      borderColor: 'gold',
      color: 'black',
      _active: null,
    },
    solid: {
      bg: 'gold',
      color: 'black',
      _hover: {
        bg: 'gold',
      },
      _active: null,
    },
  },
  defaultProps: {
    size: 'md',
    variant: 'solid',
  },
})

export default Button