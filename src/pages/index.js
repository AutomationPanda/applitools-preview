import { useState, useEffect } from 'react';
import Head from 'next/head';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Button from '@components/Button';
import Form from '@components/Form';

import styles from '@styles/pages/Home.module.scss'

const apiKey = process.env.NEXT_PUBLIC_APPLITOOLS_API_KEY;

const defaultSession = {
  url: null
}

const defaultChecks = {
  current: null,
  chaos: null,
  diff: null
}

const defaultLogData = [];

export default function Home() {
  const [session, setSession] = useState(defaultSession);
  const [isLoading, setIsLoading] = useState(false);
  const [logData, setLogData] = useState(defaultLogData);
  const [checks, setChecks] = useState(defaultChecks)

  useEffect(() => {
    if ( !checks.current ) return;
    (async function effect() {
      setIsLoading(true);

      const results = await checkEyes({
        ...session,
        type: 'chaos'
      });

      setChecks(prev => {
        return {
          ...prev,
          chaos: `${results.stepsInfo[0].apiUrls.currentImage}?apiKey=${apiKey}`,
          diff: `${results.stepsInfo[0].apiUrls.diffImage}?apiKey=${apiKey}`
        }
      });

      setIsLoading(false);
    })();
  }, [checks.current])

  /**
   * handleOnSubmit
   */

  async function handleOnSubmit(e) {
    e.preventDefault();

    setIsLoading(true);

    const formData = {};

    Array.from(e.currentTarget.elements).forEach(field => {
      if ( !field.name ) return;
      formData[field.name] = field.value;
    });

    setSession({ ...formData });

    const results = await checkEyes(formData);

    setChecks({
      ...defaultChecks,
      current: `${results.stepsInfo[0].apiUrls.currentImage}?apiKey=${apiKey}`,
    });

    setIsLoading(false);
  }

  /**
   * checkEyes
   */

  async function checkEyes(data) {
    const response = await fetch('/api/eyes', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        apiKey
      })
    });

    if ( response.status !== 200 ) {
      console.log('error');
      console.log(response);
      setIsLoading(false)
      return;
    }

    const { results } = await response.json();

    setLogData([...logData, results]);

    return results;
  }

  return (
    <Layout>
      <Head>
        <title>Applitools Preview</title>
        <meta name="description" content="Applitools Preview" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container className={styles.formContainer}>
          <h1>Applitools Preview</h1>
          <Form onSubmit={handleOnSubmit}>
            <p>
              <label htmlFor="url">Website URL</label>
              <input id="url" type="text" name="url" />
            </p>
            <p>
              <Button>Run Test</Button>
            </p>
          </Form>
        </Container>
      </Section>

      <Section>
        <Container className={styles.previewContainer} data-is-loading={isLoading}>
          <div className={styles.previewImages}>
            <div className={`${styles.previewImage} ${styles.previewImagesCurrent}`} data-is-loaded={!!checks.current}>
              <h3>Original</h3>
              <p>
                {checks.current && (
                  <img src={checks.current} />
                )}
              </p>
            </div>
            <div className={`${styles.previewImage} ${styles.previewImagesChaos}`} data-is-loaded={!!checks.chaos}>
              <h3>Chaos</h3>
              <p>
                {checks.chaos && (
                  <img src={checks.chaos} />
                )}
              </p>
            </div>
            <div className={`${styles.previewImage} ${styles.previewImagesDiff}`} data-is-loaded={!!checks.diff}>
              <h3>Diff</h3>
              <p>
                {checks.diff && (
                  <img src={checks.diff} />
                )}
              </p>
            </div>
          </div>
          {logData.length > 0 && logData.map((data, index) => {
            return <code key={index}><pre>{ JSON.stringify(data, null, 2) }</pre></code>
          })}
        </Container>
      </Section>
    </Layout>
  )
}
