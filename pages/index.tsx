import type {NextPage} from 'next';
import {Button, Stack} from "@chakra-ui/react";
import Layout from "../components/layout";
import {useRouter} from "next/router";

const Home: NextPage = () => {
  const router = useRouter()

  return (
    <Layout>
      <Stack h={'full'} alignItems={"center"} justify={"center"}>
        <Button
          onClick={async () => {
            await router.push('/pools/0')
          }}
        >
          Pool
        </Button>
      </Stack>
    </Layout>
  );
};

export default Home;
