import NetInfo from "@react-native-community/netinfo";

// Fungsi untuk mengecek apakah user pakai Wifi atau Data Seluler
export const checkConnection = () => {
  NetInfo.fetch().then(state => {
    console.log("Tipe Koneksi:", state.type);
    console.log("Apakah Terhubung?", state.isConnected);
  });
};
