import {isValidMotionProp, motion} from "framer-motion";
import {chakra} from "@chakra-ui/react";

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: isValidMotionProp,
})

export default ChakraBox