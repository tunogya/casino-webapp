import { extendTheme } from '@chakra-ui/react'
import Button from './components/button'
import Text from './components/text'
import Heading from "./components/heading";
import Badge from "./components/badge";
import Input from "./components/input";
import Link from "./components/link";

const overrides = {
  styles: {
    global: {
      'html, body': {
        backgroundColor: 'black',
      },
      a: {
        color: 'white',
        '-webkit-user-select': 'none',
      },
    }
  },
  components: {
    Button,
    Text,
    Heading,
    Badge,
    Input,
    Link
  },
}

export default extendTheme(overrides)