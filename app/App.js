import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const GITHUB_USERNAME = "github.com/coffeeCapy"; // Ganti dengan username GitHub Anda
const REPO_NAME = "isc-mobile-app1";
const GITHUB_TOKEN = "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"; // Kita akan bahas ini di bawah

export default function App() {
  const [status, setStatus] = useState("Idle");

  const sendMiningData = async () => {
    setStatus("Mengirim Data...");
    
    try {
      const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'update_mining_data', // Ini harus sama dengan di validator.yml
          client_payload: {
            user_address: "0xUserBudi123", // Alamat dompet user
            mb_shared: 50 // Contoh: user berbagi 50MB
          }
        })
      });

      if (response.ok) {
        setStatus("Berhasil! Koin diproses.");
      } else {
        setStatus("Gagal mengirim laporan.");
      }
    } catch (error) {
      setStatus("Error: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ISC Miner 🌐</Text>
      <Text style={styles.status}>Status: {status}</Text>
      
      <TouchableOpacity style={styles.button} onPress={sendMiningData}>
        <Text style={styles.buttonText}>Kirim Laporan Data (Mine)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  status: { fontSize: 16, color: 'blue', marginBottom: 30 },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
