import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

export default function Screen1() {
  const [diemToan, setDiemToan] = useState("");
  const [tn1, setTn1] = useState("");
  const [tn2, setTn2] = useState("");
  const [tn3, setTn3] = useState("");
  const [tb10, setTb10] = useState("");
  const [tb11, setTb11] = useState("");
  const [tb12, setTb12] = useState("");

  const [result, setResult] = useState(null);

  const handleCalculate = async () => {
    try {
      // Chuyển các chuỗi thành số
      const diemToanNum = parseFloat(diemToan.replace(",", "."));
      const diemThiTNTHPT = [tn1, tn2, tn3].map((s) =>
        parseFloat(s.replace(",", "."))
      );
      const diemTbThpt = [tb10, tb11, tb12].map((s) =>
        parseFloat(s.replace(",", "."))
      );

      // Kiểm tra hợp lệ
      if (
        isNaN(diemToanNum) ||
        diemThiTNTHPT.some(isNaN) ||
        diemTbThpt.some(isNaN)
      ) {
        Alert.alert(
          "Lỗi",
          "Vui lòng nhập đầy đủ và đúng định dạng các số điểm."
        );
        return;
      }

      // Gửi request tới backend
      const response = await fetch(
        "http://10.106.22.240:5555/api/diem-hoc-luc",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            diemToan: diemToanNum,
            diemThiTNTHPT,
            diemTbThpt,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra.");
      }

      setResult(data);
      Keyboard.dismiss();
    } catch (err) {
      Alert.alert("Lỗi", err.message);
      setResult(null);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🎓 Tính điểm học lực - Đối tượng 1</Text>

        {/* ĐIỂM TOÁN */}
        <Text style={styles.label}>Điểm ĐGNL (Toán ×2):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={diemToan}
          onChangeText={setDiemToan}
          placeholder="Tối Đa Môn Toán 300"
        />

        {/* THI TNTHPT */}
        <Text style={styles.sectionTitle}>Điểm thi TNTHPT:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={tn1}
          onChangeText={setTn1}
          placeholder="Môn 1"
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={tn2}
          onChangeText={setTn2}
          placeholder="Môn 2"
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={tn3}
          onChangeText={setTn3}
          placeholder="Môn 3"
        />

        {/* HỌC BẠ */}
        <Text style={styles.sectionTitle}>Điểm học bạ:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={tb10}
          onChangeText={setTb10}
          placeholder="Lớp 10"
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={tb11}
          onChangeText={setTb11}
          placeholder="Lớp 11"
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={tb12}
          onChangeText={setTb12}
          placeholder="Lớp 12"
        />

        {/* NÚT TÍNH */}
        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Text style={styles.buttonText}>Tính điểm</Text>
        </TouchableOpacity>

        {/* HIỂN THỊ KẾT QUẢ */}
        {result && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}> Kết quả:</Text>
            <Text> Điểm năng lực: {result.diemNangLuc}</Text>
            <Text> TNTHPT quy đổi: {result.diemThiTNTHPTQuyDoi}</Text>
            <Text> Học bạ quy đổi: {result.diemHocTHPTQuyDoi}</Text>
            <Text style={styles.finalScore}>
              Điểm học lực: {result.diemHocLuc} / 100
            </Text>
          </View>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f4f8",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a237e",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "bold",
    color: "#00796b",
  },
  button: {
    backgroundColor: "#007BFF",
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  resultBox: {
    backgroundColor: "#e8f5e9",
    padding: 15,
    marginTop: 30,
    borderRadius: 8,
    borderColor: "#66bb6a",
    borderWidth: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 10,
  },
  finalScore: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#1b5e20",
  },
});
