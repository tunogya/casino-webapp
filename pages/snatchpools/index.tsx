import Layout from "../../components/layout";
import {useEffect} from "react";
import {useRouter} from "next/router";

const Snatchpools = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/snatchpools/0')
  }, [router])

  return (
    <Layout>
      <div>Loading...</div>
    </Layout>
  )
}

export default Snatchpools