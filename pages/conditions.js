import Head from "next/head";
import WithAuthComponent from "../src/Hocs/PrivateRoute";
import DashLayout from "../src/Components/DashLayout";
import Condition from "../src/Components/Pages/Condition";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Prokat uz</title>
        <meta name="description" content="Prokat Uz" />
       <link rel="icon" href="/icons/logo.svg" />
      </Head>
      <WithAuthComponent>
        <DashLayout>
        <Condition/>
        </DashLayout>
      </WithAuthComponent>
    </div>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
