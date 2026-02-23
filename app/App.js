import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo'; // Pastikan library ini ada, atau gunakan View biasa jika error

const { width } = Dimensions.get('window');

export default function App() {
  const [tab, setTab] = useState('home');
  const [isMining, setIsMining] = useState(false);
  const [dataMB, setDataMB] = useState(0);
  const [balance, setBalance] = useState(0); // Saldo ISC
  const [logs, setLogs] = useState([]);
  const [walletAddress, setWalletAddress] = useState('0xDompetAhmad123'); // Default dompet Anda

  // --- CONFIG (Sesuaikan Token Anda) ---
  const GITHUB_TOKEN = "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"; 
  const REPO_OWNER = "CoffeeCapy";
  const REPO_NAME = "isc-mobile-app1";

  useEffect(() => {
    let interval;
    if (isMining) {
      interval = setInterval(() => {
        setDataMB(prev => {
          const newMB = prev + 0.5;
          if (newMB >= 10) {
            sendDataToGithub(10);
            return 0;
          }
          return newMB;
        });
      }, 500); // Kecepatan testing
    }
    return () => clearInterval(interval);
  }, [isMining]);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const sendDataToGithub = async (amount) => {
    addLog("📡 Mengirim data...");
    try {
      const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          event_type: "update_mining_data",
          client_payload: { user_address: walletAddress, mb_shared: amount }
        }),
      });

      if (response.ok) {
        setBalance(prev => prev + amount);
        addLog("✅ SUKSES! +10 ISC");
      } else {
        addLog("❌ Gagal Kirim!");
      }
    } catch (e) {
      addLog("❌ Error: " + e.message);
    }
  };

  const handleWithdraw = () => {
    if (balance < 100) {
      Alert.alert("Saldo Tidak Cukup", "Minimal Withdraw adalah 100 ISC");
    } else {
      Alert.alert("Withdraw Berhasil", `Permintaan WD sebesar ${balance} ISC telah dikirim ke jaringan.`);
      setBalance(0);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ISC NETWORK</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>MAINNET READY</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'home' ? (
          <View>
            {/* CARD SALDO UTAMA */}
            <View style={styles.balanceCard}>
               <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
               <Text style={styles.balanceValue}>{balance.toLocaleString()} <Text style={{fontSize: 20}}>ISC</Text></Text>
            </View>

            {/* MINING PANEL */}
            <View style={styles.miningPanel}>
              <Text style={styles.panelTitle}>Mining Status</Text>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${(dataMB / 10) * 100}%` }]} />
              </View>
              <Text style={styles.progressText}>{dataMB.toFixed(1)} / 10.0 MB Shared</Text>
              
              <TouchableOpacity 
                style={[styles.btnAction, isMining ? styles.btnStop : styles.btnStart]} 
                onPress={() => setIsMining(!isMining)}
              >
                <Text style={styles.btnActionText}>{isMining ? "STOP MINING" : "START MINING"}</Text>
              </TouchableOpacity>
            </View>

            {/* MONITOR LOGS */}
            <View style={styles.logContainer}>
              <Text style={styles.logTitle}>Network Monitor</Text>
              {logs.map((log, i) => (
                <Text key={i} style={styles.logText}> {'>'} {log}</Text>
              ))}
            </View>
          </View>
        ) : (
          <View>
            {/* MENU WITHDRAW */}
            <View style={styles.withdrawCard}>
               <Text style={styles.panelTitle}>Withdrawal</Text>
               <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Wallet Address</Text>
                  <TextInput 
                    style={styles.input} 
                    value={walletAddress} 
                    onChangeText={setWalletAddress}
                    placeholder="0x..."
                    placeholderTextColor="#666"
                  />
               </View>
               <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Amount to Withdraw</Text>
                  <Text style={styles.wdAmount}>{balance} ISC</Text>
               </View>
               <TouchableOpacity style={styles.btnWD} onPress={handleWithdraw}>
                  <Text style={styles.btnActionText}>CONFIRM WITHDRAW</Text>
               </TouchableOpacity>
               <Text style={styles.infoText}>*Estimasi waktu pengiriman: 5-10 menit tergantung kepadatan blockchain.</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* BOTTOM TABS NAVIGATION */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setTab('home')}>
          <Text style={[styles.tabText, tab === 'home' && styles.tabActive]}>MINING</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setTab('wallet')}>
          <Text style={[styles.tabText, tab === 'wallet' && styles.tabActive]}>WALLET</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0e11' },
  header: { paddingTop: 50, paddingBottom: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1e2329' },
  headerTitle: { color: '#f0b90b', fontSize: 22, fontWeight: 'bold', letterSpacing: 2 },
  badge: { backgroundColor: '#2ebd85', paddingHorizontal: 8, borderRadius: 4, marginTop: 5 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  content: { padding: 20 },
  
  // Balance Card
  balanceCard: { backgroundColor: '#1e2329', borderRadius: 15, padding: 25, marginBottom: 20, alignItems: 'center' },
  balanceLabel: { color: '#848e9c', fontSize: 12, marginBottom: 5 },
  balanceValue: { color: '#fff', fontSize: 40, fontWeight: 'bold' },

  // Mining Panel
  miningPanel: { backgroundColor: '#161a1e', borderRadius: 15, padding: 20, marginBottom: 20 },
  panelTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 15 },
  progressContainer: { height: 8, backgroundColor: '#2b3139', borderRadius: 4, marginBottom: 10 },
  progressBar: { height: '100%', backgroundColor: '#f0b90b', borderRadius: 4 },
  progressText: { color: '#848e9c', textAlign: 'right', fontSize: 12, marginBottom: 20 },
  
  btnAction: { paddingVertical: 15, borderRadius: 10, alignItems: 'center' },
  btnStart: { backgroundColor: '#2ebd85' },
  btnStop: { backgroundColor: '#f6465d' },
  btnActionText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Log Monitor
  logContainer: { backgroundColor: '#000', borderRadius: 10, padding: 15, height: 150 },
  logTitle: { color: '#2ebd85', fontSize: 12, marginBottom: 10, fontWeight: 'bold' },
  logText: { color: '#00ff00', fontFamily: 'monospace', fontSize: 11, marginBottom: 5 },

  // Withdraw Styling
  withdrawCard: { backgroundColor: '#1e2329', borderRadius: 15, padding: 20 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { color: '#848e9c', marginBottom: 8, fontSize: 14 },
  input: { backgroundColor: '#0b0e11', borderRadius: 8, padding: 12, color: '#fff', borderWidth: 1, borderColor: '#474d57' },
  wdAmount: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  btnWD: { backgroundColor: '#f0b90b', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  infoText: { color: '#848e9c', fontSize: 11, marginTop: 15, textAlign: 'center' },

  // Tab Bar
  tabBar: { flexDirection: 'row', height: 70, backgroundColor: '#161a1e', borderTopWidth: 1, borderTopColor: '#1e2329' },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabText: { color: '#848e9c', fontWeight: 'bold', fontSize: 12 },
  tabActive: { color: '#f0b90b' }
});
