import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { trackMiningData } from './logic/DataTracker';

export default function App() {
  const [mbShared, setMbShared] = useState(0);

  useEffect(() => {
    // Jalankan pengecekan setiap 30 detik
    const interval = setInterval(async () => {
      const isMining = await trackMiningData();
      
      if (isMining) {
        // Simulasi: Tambah 1MB setiap 30 detik jika terkoneksi
        setMbShared(prev => prev + 1);
        
        // Kirim ke GitHub setiap kelipatan 10MB agar hemat baterai/request
        if ((mbShared + 1) % 10 === 0) {
           simpanKeGitHub("0xWalletUserAnda", 10);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [mbShared]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ISC Miner Active 🌐</Text>
      <Text style={styles.dataText}>Data Terbagi: {mbShared} MB</Text>
      <Text style={styles.coinText}>Estimasi Koin: {mbShared} ISC</Text>
    </View>
  );
}

// Fungsi ini akan memicu Robot Validator.yml yang Anda buat tadi
async function simpanKeGitHub(wallet, amount) {
  // Gunakan Fetch API ke GitHub Dispatch seperti yang kita bahas sebelumnya
  console.log(`Mengirim laporan ${amount}MB ke GitHub...`);
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  title: { color: '#00ff00', fontSize: 20, fontWeight: 'bold' },
  dataText: { color: '#fff', fontSize: 40 },
  coinText: { color: '#aaa', fontSize: 16 }
});
