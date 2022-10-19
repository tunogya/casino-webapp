import Layout from "../../components/layout";
import {
  Button, Divider,
  FormControl,
  FormHelperText, FormLabel,
  HStack,
  Input,
  Stack,
  Text
} from "@chakra-ui/react";
import {useState} from "react";

type Config = {
  paymentToken: string | undefined,
  singleDrawPrice: number | undefined,
  batchDrawPrice: number | undefined,
  batchDrawSize: number | undefined,
  rarePrizeToken: string | undefined,
  rarePrizeInitRate: number | undefined,
  rarePrizeAvgRate: number | undefined,
  rarePrizeValue: number | undefined,
  rarePrizeMaxRP: number | undefined,
  normalPrizesToken: string[] | [],
  normalPrizesValue: number[] | [],
  normalPrizesRate: number[] | [],
}

const Create = () => {
  const [config, setConfig] = useState<Config>({
    paymentToken: undefined,
    singleDrawPrice: undefined,
    batchDrawPrice: undefined,
    batchDrawSize: undefined,
    rarePrizeToken: undefined,
    rarePrizeInitRate: undefined,
    rarePrizeAvgRate: undefined,
    rarePrizeValue: undefined,
    rarePrizeMaxRP: undefined,
    normalPrizesToken: [],
    normalPrizesValue: [],
    normalPrizesRate: [],
  })
  const [normalConfig, setNormalConfig] = useState({
    normalPrizesToken: '',
    normalPrizesValue: 0,
    normalPrizesRate: 0,
  })

  return (
    <Layout>
      <Stack w={'container.md'} py={'20px'}>
        <HStack>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>Payment Token Address</FormLabel>
            <Input placeholder={"Payment Token Address"}
                   onChange={e => setConfig({...config, paymentToken: e.target.value})}/>
            <FormHelperText></FormHelperText>
          </FormControl>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>Single Draw Price</FormLabel>
            <Input placeholder={"Single Draw Price"}
                   onChange={e => setConfig({...config, singleDrawPrice: Number(e.target.value)})}/>
            <FormHelperText></FormHelperText>
          </FormControl>
        </HStack>
        <HStack>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>Batch Draw Size</FormLabel>
            <Input placeholder={"Batch Draw Size"}
                   onChange={e => setConfig({...config, batchDrawSize: Number(e.target.value)})}/>
            <FormHelperText></FormHelperText>
          </FormControl>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>Batch Draw Price</FormLabel>
            <Input placeholder={"Batch Draw Price"}
                   onChange={e => setConfig({...config, batchDrawPrice: Number(e.target.value)})}/>
            <FormHelperText></FormHelperText>
          </FormControl>
        </HStack>
        <FormControl as='fieldset'>
          <FormLabel as='legend'>Rare Prize Token</FormLabel>
          <Input placeholder={"Rare Prize Token"}
                 onChange={e => setConfig({...config, rarePrizeToken: e.target.value})}/>
          <FormHelperText></FormHelperText>
        </FormControl>
        <HStack>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>Rare Prize Init Rate</FormLabel>
            <Input placeholder={"Rare Prize Init Rate"}
                   onChange={e => setConfig({...config, rarePrizeInitRate: Number(e.target.value)})}/>
            <FormHelperText></FormHelperText>
          </FormControl>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>Rare Prize Avg Rate</FormLabel>
            <Input placeholder={"Rare Prize Avg Rate"}
                   onChange={e => setConfig({...config, rarePrizeAvgRate: Number(e.target.value)})}/>
            <FormHelperText></FormHelperText>
          </FormControl>
        </HStack>
        <HStack>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>Rare Prize Value</FormLabel>
            <Input placeholder={"Rare Prize Value"}
                   onChange={e => setConfig({...config, rarePrizeValue: Number(e.target.value)})}/>
            <FormHelperText></FormHelperText>
          </FormControl>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>Rare Prize Max RP</FormLabel>
            <Input placeholder={"Rare Prize Max RP"}
                   onChange={e => setConfig({...config, rarePrizeMaxRP: Number(e.target.value)})}/>
            <FormHelperText></FormHelperText>
          </FormControl>
        </HStack>
        <Divider/>
        <HStack>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>Normal Prizes Token</FormLabel>
            <Input
              placeholder={"Normal Prizes Token"}
              onChange={e => setNormalConfig({...normalConfig, normalPrizesToken: e.target.value})}
              value={normalConfig.normalPrizesToken}
            />
            <FormHelperText></FormHelperText>
          </FormControl>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>Normal Prizes Value</FormLabel>
            <Input
              placeholder={"Normal Prizes Value"}
              onChange={e => setNormalConfig({...normalConfig, normalPrizesValue: Number(e.target.value)})}
              value={normalConfig.normalPrizesValue}
            />
            <FormHelperText></FormHelperText>
          </FormControl>
          <FormControl as='fieldset'>
            <FormLabel as='legend'>Normal Prizes Rate</FormLabel>
            <Input
              placeholder={"Normal Prizes Rate"}
              onChange={e => setNormalConfig({...normalConfig, normalPrizesRate: Number(e.target.value)})}
              value={normalConfig.normalPrizesRate}
            />
            <FormHelperText></FormHelperText>
          </FormControl>
        </HStack>
        <HStack justify={"end"}>
          <Button
            isDisabled={normalConfig.normalPrizesToken === '' || normalConfig.normalPrizesValue === 0 || normalConfig.normalPrizesRate === 0}
            onClick={() => {
              setConfig({
                ...config,
                normalPrizesToken: [...config.normalPrizesToken, normalConfig.normalPrizesToken],
                normalPrizesValue: [...config.normalPrizesValue, normalConfig.normalPrizesValue],
                normalPrizesRate: [...config.normalPrizesRate, normalConfig.normalPrizesRate]
              })
              setNormalConfig({
                normalPrizesToken: '',
                normalPrizesValue: 0,
                normalPrizesRate: 0,
              })
            }}
          >
            + Normal Prize
          </Button>
        </HStack>
        <Divider/>
        <HStack>
          <Button>
            Create Pool
          </Button>
        </HStack>
        <Text>
          {JSON.stringify(config)}
        </Text>
      </Stack>
    </Layout>
  )
}

export default Create