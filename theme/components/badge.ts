import { defineStyleConfig } from '@chakra-ui/react'

const Badge = defineStyleConfig({
  baseStyle: {
    fontWeight: 700,
    borderRadius: '12px',
    fontFamily: 'Syncopate',
    padding: '8px',
  },
  variants: {
    outline: {
      border: '1px solid',
      borderColor: 'yellow.900',
      color: 'yellow.900',
      bg: 'white',
      _active: null,
      _hover: null,
    },
    solid: {
      bg: 'teal.200',
      color: 'yellow.900',
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

export default Badge