import React from 'react';
import Layout from '@theme/Layout';

export default function Offline() {
  return (
    <Layout title="Offline">
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <h1>आपण ऑफलाइन आहात</h1>
            <p>
              इंटरनेट कनेक्शन नसल्यामुळे आपण सध्या ऑफलाइन आहात. 
              मागील भेटीत कॅशे केलेली माहिती पाहण्यासाठी मेनू वापरा.
            </p>
            <button
              className="button button--primary"
              onClick={() => window.location.reload()}
            >
              पुन्हा प्रयत्न करा
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}