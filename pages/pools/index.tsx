import {atom, useRecoilState} from "recoil";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {SNATCH_ADDRESS} from "../../constant/address";
import SNATCH_ABI from "../../abis/Snatch.json";
import {useContractReads, useNetwork} from "wagmi";
import Layout from "../../components/layout";
import {BigNumber} from "ethers";

export const poolIdsAtom = atom({
  key: 'poolIds',
  default: [0],
});

const Pools = () => {
  const router = useRouter()
  const {chain } = useNetwork()
  const [, setPoolIds] = useRecoilState(poolIdsAtom);

  const SnatchContract = {
    addressOrName: SNATCH_ADDRESS[chain?.id || 5],
    contractInterface: SNATCH_ABI,
  }

  const {data} = useContractReads({
    contracts: [
      {
        ...SnatchContract,
        functionName: 'nextPoolId',
      },
      {
        ...SnatchContract,
        functionName: 'owner',
      }
    ]
  })

  useEffect(() => {
    if (BigNumber.from(data?.[0] || 0).gt(BigNumber.from(0))) {
      router.push('/pools/0')
    } else if (BigNumber.from(data?.[0] || 0).eq(BigNumber.from(0))) {
      router.push('/pools/create')
    }
  }, [data, router])

  useEffect(() => {
    const nextPoolId = BigNumber.from(data?.[2] || 0).toNumber()
    const ids = []
    for (let i = 0; i < nextPoolId; i++) {
      ids.push(i)
    }
    setPoolIds(ids)
  }, [data, setPoolIds])

  return (
    <Layout>
      <div>loading...</div>
    </Layout>
  )
}

export default Pools;