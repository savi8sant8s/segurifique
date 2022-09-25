import { useState } from 'react';
import styles from '../styles/Home.module.css'
import axios from 'axios';

export default function Home() {
  const [url, setUrl] = useState('');

  const handleSubmit = async () => {
    axios.get(`/api/scan?url=${url}`).then((res) => {
      console.log(res.data)
    })
  }

  return (
    <div className={styles.container}>
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button onClick={handleSubmit}>Escanear URL</button>
    </div>
  )
}
