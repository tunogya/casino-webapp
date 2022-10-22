import { extendTheme } from '@chakra-ui/react'
import Button from './components/button'
import Text from './components/text'
import Heading from "./components/heading";
import Badge from "./components/badge";

const overrides = {
  components: {
    Button,
    Text,
    Heading,
    Badge,
  },
}

export default extendTheme(overrides)