import Layout from "../../components/layout";
import {Badge, Button, Heading, HStack, Link, Stack} from "@chakra-ui/react";
import PrintingPodCard from "../../components/PrintingPodCard";
import {
  useAccount, useBalance,
  useContractReads,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction
} from "wagmi";
import {PRINTING_POD_ADDRESS} from "../../constant/address";
import PrintingPodSetting from "../../components/PrintingPodSetting";
import PRINTING_POD_API from "../../abis/PrintingPod.json";
import {useEffect, useMemo, useState} from "react";
import {ethers} from "ethers";

const Printingpod = () => {
  const {chain, chains} = useNetwork()
  const {address} = useAccount()
  const PrintingPodContract = {
    addressOrName: PRINTING_POD_ADDRESS[chain?.id || 5],
    contractInterface: PRINTING_POD_API,
  }
  const {data: printingPodData} = useContractReads({
    contracts: [
      {
        ...PrintingPodContract,
        functionName: 'owner',
      },
      {
        ...PrintingPodContract,
        functionName: 'draftInterestDNAsOf',
        args: [address],
      },
      {
        ...PrintingPodContract,
        functionName: 'sponsorWallet',
      },
    ],
    watch: true,
    cacheTime: 3_000,
  })
  const {config: drawConfig} = usePrepareContractWrite({
    addressOrName: PRINTING_POD_ADDRESS[chain?.id || 5],
    contractInterface: PRINTING_POD_API,
    functionName: 'draw',
    args: ['3'],
    overrides: {
      value: 0,
      gasLimit: 1000000,
    }
  })
  const {write: drawWrite, data: drawData, isLoading: isDrawLoading} = useContractWrite(drawConfig)
  const {status: waitDrawStatus} = useWaitForTransaction({
    wait: drawData?.wait
  })
  const [sponsorWallet, setSponsorWallet] = useState<string | undefined>(undefined)
  const {data: sponsorWalletData} = useBalance({
    addressOrName: sponsorWallet,
    watch: true,
    cacheTime: 3_000,
  })

  useEffect(() => {
    if (printingPodData?.[2]) {
      setSponsorWallet(printingPodData?.[2].toString())
    }
  }, [printingPodData])

  const etherscanUrl = useMemo(() => {
    if (chain) {
      return chain?.blockExplorers?.etherscan?.url
    }
    if (chains) {
      return chains?.[0]?.blockExplorers?.etherscan?.url
    }
  }, [chain, chains])

  return (
    <Layout>
      <Stack h={'full'} w={'full'} align={"center"} p={['12px', '24px']} spacing={'48px'}>
        <Heading>Printing Pod</Heading>
        <Stack w={'full'} h={'full'} maxW={'container.md'} spacing={'48px'}>
          <HStack spacing={'24px'} justify={"center"}>
            {sponsorWalletData && (
              <Badge variant={'outline'}>
                <Link href={`${etherscanUrl}/address/${sponsorWallet}`} isExternal
                      fontSize={'sm'}>sponsor: {Number(ethers.utils.formatUnits(sponsorWalletData.value, sponsorWalletData.decimals)).toLocaleString()} {sponsorWalletData.symbol}</Link>
              </Badge>
            )}
            <Button
              disabled={!drawWrite}
              isLoading={isDrawLoading || waitDrawStatus === 'loading'}
              onClick={() => drawWrite?.()}>Draw x3</Button>
            {
              printingPodData?.[0] === address && (
            <PrintingPodSetting/>
              )
            }
          </HStack>
          <HStack spacing={'24px'} justify={"center"}>
            <PrintingPodCard />
            <PrintingPodCard />
            <PrintingPodCard />
          </HStack>
        </Stack>
      </Stack>
    </Layout>
  )
}

export default Printingpod