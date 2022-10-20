import type {NextPage} from 'next';
import {Stack, Text} from "@chakra-ui/react";
import Layout from "../components/layout";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <Layout>
      <Stack h={'full'} alignItems={"center"} justify={"center"}>
        <Link href={'/create'}>Create Pool</Link>
        <Link href={'/pools/0'}>Pool</Link>
      </Stack>
    </Layout>
  );
};

export default Home;
