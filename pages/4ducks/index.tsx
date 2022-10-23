import {useAccount} from "wagmi";
import {useEffect} from "react";
import {useRouter} from "next/router";
import Layout from "../../components/layout";

const _4Ducks = () => {
  const {address} = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (address) {
      router.push(`/4ducks/${address}`)
    } else {
      router.push(`/4ducks/0x0000000000000000000000000000000000000000`)
    }
  }, [address, router])

  return (
    <Layout>
      <div>loading...</div>
    </Layout>
  )
}

export default _4Ducks;