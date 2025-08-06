const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// =================== API: Tính điểm học lực (Đối tượng 1 - dùng duy nhất điểm Toán) ===================
app.post("/api/diem-hoc-luc", (req, res) => {
  const { diemToan, diemThiTNTHPT, diemTbThpt } = req.body;

  // Kiểm tra đầu vào hợp lệ
  if (
    typeof diemToan !== "number" || diemToan < 0 || diemToan > 300 ||
    !Array.isArray(diemThiTNTHPT) || diemThiTNTHPT.length !== 3 ||
    !Array.isArray(diemTbThpt) || diemTbThpt.length !== 3
  ) {
    return res.status(400).json({ error: "Dữ liệu đầu vào không hợp lệ." });
  }

  //  Tính các điểm quy đổi
  const diemNangLuc = (diemToan * 2) / 15;
  const diemThiTNTHPTQuyDoi =
    (diemThiTNTHPT.reduce((a, b) => a + b, 0) / 3) * 10;
  const diemHocTHPTQuyDoi =
    (diemTbThpt.reduce((a, b) => a + b, 0) / 3) * 10;

  //  Tính điểm học lực theo công thức chuẩn
  const diemHocLuc =
    diemNangLuc * 0.7 +
    diemThiTNTHPTQuyDoi * 0.2 +
    diemHocTHPTQuyDoi * 0.1;

  //  Trả kết quả
  res.json({
    diemToan: diemToan.toFixed(2),
    diemNangLuc: diemNangLuc.toFixed(2),
    diemThiTNTHPTQuyDoi: diemThiTNTHPTQuyDoi.toFixed(2),
    diemHocTHPTQuyDoi: diemHocTHPTQuyDoi.toFixed(2),
    diemHocLuc: diemHocLuc.toFixed(2)
  });
});

// =================== Khởi động server ===================
const PORT = 5555;
app.listen(PORT, () => {
  console.log(` Server đang chạy tại: http://localhost:${PORT}`);
});
