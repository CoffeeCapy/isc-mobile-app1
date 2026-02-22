import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// ==========================================
// 1. KONFIGURASI GITHUB (SUDAH DIISI)
// ==========================================
const GITHUB_USERNAME = "CoffeeCapy"; 
const REPO_NAME = "isc-mobile-app1";            
const GITHUB_TOKEN = "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"; // <-- Hapus tulisan ini, masukkan token ghp_ Anda
const WALLET_ADDRESS = "0xDompetAhmad123";      // Alamat dompet crypto Anda

export default function App() {
  const [mbShared, setMbShared] = useState(0);
  const [status, setStatus] = useState("Standby");
  const [isMining, setIsMining] = useState(false);

  // ==========================================
  // 2. MESIN PENAMBANG OTOMATIS
  // ==========================================
  useEffect(() => {
    let interval;
    
    if (isMining) {
      setStatus("Menambang (Aktif)...");
      
      // Mesin akan berjalan dan menambah data setiap 3 detik (Simulasi cepat)
      interval = setInterval(() => {
        setMbShared(prev => {
          const newTotal = prev + 1; // Tambah 1 MB
          
          // Lapor ke GitHub otomatis setiap kelipatan 10 MB
          if (newTotal % 10 === 0) {
             laporKeRobotGitHub(10);
          }
          return newTotal;
        });
      }, 3000); 
      
    } else {
      setStatus("Berhenti.");
    }

    // Bersihkan mesin kalau tombol stop ditekan
    return () => clearInterval(interval);
  }, [isMining]);

  // ==========================================
  // 3. FUNGSI PENGIRIM KE GITHUB ACTIONS
  // ==========================================
  async function laporKeRobotGitHub(amount) {
    try {
      console.log(`Mengirim laporan ${amount} MB ke GitHub...`);
      
      const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'update_mining_data', // Sandi rahasia pemanggil robot
          client_payload: {
            user_address: WALLET_ADDRESS,
            mb_shared: amount 
          }
        })
      });

      if (response.ok) {
         console.log("✅ Laporan sukses terkirim ke GitHub!");
      } else {
         console.error("❌ Gagal lapor. Cek token atau username Anda.");
      }
    } catch (e) {
      console.error("Gagal koneksi ke internet:", e);
    }
  }

  // ==========================================
  // 4. TAMPILAN APLIKASI (UI)
  // ==========================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ISC NETWORK 🌐</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Status Sistem:</Text>
        <Text style={[styles.value, {color: isMining ? "#00ff00" : "#ff4444"}]}>{status}</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.label}>Data Terbagi / Koin Didapat:</Text>
        <Text style={styles.value}>{mbShared} MB / {mbShared} ISC</Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, {backgroundColor: isMining ? "#ff4444" : "#28a745"}]} 
        onPress={() => setIsMining(!isMining)}
      >
        <Text style={styles.buttonText}>
          {isMining ? "Hentikan Penambangan" : "Mulai Menambang"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ==========================================
// 5. GAYA TAMPILAN (CSS)
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212', padding: 20 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  card: { backgroundColor: '#1a1a1a', padding: 20, borderRadius: 15, width: '100%', marginBottom: 15, alignItems: 'center' },
  label: { color: '#888888', fontSize: 14, marginBottom: 5 },
  value: { color: '#ffffff', fontSize: 24, fontWeight: 'bold' },
  button: { padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' }
});
