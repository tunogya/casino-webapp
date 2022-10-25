import Layout from "../../components/layout";
import {useRouter} from "next/router";
import {useAccount} from "wagmi";
import {useEffect} from "react";

const _4ducks = () => {
  const router = useRouter()
  const {address} = useAccount()

  useEffect(() => {
    if (address) {
      router.push(`/4ducks/${address}`)
    } else {
      router.push('/4ducks/0x0000000000000000000000000000000000000000')
    }
  }, [address, router])

  return (
    <Layout>
      <div>Loading...</div>
    </Layout>
  )
}

export default _4ducks