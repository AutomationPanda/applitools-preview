import { useState } from 'react';
import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';
import Form from '@components/Form';

import styles from '@styles/pages/Home.module.scss'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [logData, setLogData] = useState();

  async function handleOnSubmit(e) {
    e.preventDefault();

    setIsLoading(true);

    const formData = {};

    Array.from(e.currentTarget.elements).forEach(field => {
      if ( !field.name ) return;
      formData[field.name] = field.value;
    });

    console.log('formData', formData)

    const response = await fetch('/api/eyes', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if ( response.status !== 200 ) {
      console.log('no')
      setIsLoading(false)
      return;
    }

    const { results } = await response.json();

    console.log('results', results)

    setLogData(results);
    setIsLoading(false)
  }


  return (
    <Layout>
      <Head>
        <title>Applitools Preview</title>
        <meta name="description" content="Applitools Preview" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container>
          <h1>Applitools Preview</h1>

          <div className={styles.twitch}>
            <div className={styles.forms}>
              <Form onSubmit={handleOnSubmit}>
                <h2>Visually Test</h2>
                <p>
                  <label htmlFor="url">Website URL</label>
                  <input id="url" type="text" name="url" />
                </p>
                <p>
                  <label htmlFor="apiKey">Applitools API Key</label>
                  <input id="apiKey" type="text" name="apiKey" />
                </p>
                <p>
                  <Button>Run Test</Button>
                </p>
              </Form>
            </div>
            <div className={styles.preview}>
              {isLoading && <p>Loading...</p>}
              {!isLoading && logData && JSON.stringify(logData, null, 2) }
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  )
}
