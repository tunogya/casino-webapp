import {atom, useRecoilState} from "recoil";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {SNATCH_ADDRESS} from "../../constant/address";
import SNATCH_ABI from "../../abis/Snatch.json";
import {useContractReads, useNetwork} from "wagmi";
import Layout from "../../components/layout";

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
    if (data?.[0].toNumber() > 0) {
      router.push('/pools/0')
    } else if (data?.[0].toNumber() === 0) {
      router.push('/pools/create')
    }
  }, [data, router])

  useEffect(() => {
    if (data?.[2]) {
      const nextPoolId = data?.[2].toNumber()
      const ids = []
      for (let i = 0; i < nextPoolId; i++) {
        ids.push(i)
      }
      setPoolIds(ids)
    }
  }, [data, setPoolIds])

  return (
    <Layout>
      <div>loading...</div>
    </Layout>
  )
}

export default Pools;