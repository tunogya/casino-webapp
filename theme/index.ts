import { extendTheme } from '@chakra-ui/react'
import Button from './components/button'

const overrides = {
  components: {
    Button,
  },
}

export default extendTheme(overrides)