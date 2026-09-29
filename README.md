# DIY Mini Drone ESP32 AI

Hướng dẫn trực quan (tiếng Việt) để tự làm một mini drone 4 cánh chạy [ESP-Drone](https://github.com/espressif/esp-drone), có tự cân bằng, giữ độ cao, giữ vị trí trong nhà và camera AI.

**Xem hướng dẫn:** https://tvlgiao.github.io/diy-mini-drone-esp32-ai/

## Nội dung

1. **Chuẩn bị đồ** — danh sách linh kiện, bảng tính cân nặng và thời gian bay
2. **Nối dây** — sơ đồ tương tác, cây nguồn, mạch driver AO3400
3. **Lắp ráp** — mô phỏng 12 bước nhìn từ trên xuống
4. **Cài phần mềm** — ESP-IDF v5.0, menuconfig, nạp firmware
5. **Dạy máy nhìn** — module `ai_uart.c` cho ESP-Drone, sketch XIAO ESP32-S3 bám vật màu, Edge Impulse FOMO
6. **Kết nối và bay** — Wi-Fi, checklist trước khi bay, 6 cấp bay thử, chỉnh PID
7. **Thử động cơ** — mô phỏng bộ trộn motor theo đúng công thức của ESP-Drone

## Phần cứng chính

ESP32-WROOM-32 DevKit · MPU6050 · PMW3901 (SPI) · VL53L1X · motor coreless 8520 · AO3400 · LiPo 1S · buck-boost 3,3 V · XIAO ESP32-S3 Sense

## Lưu ý an toàn

Có hàn điện, pin LiPo và cánh quạt quay nhanh. Trẻ em chỉ làm khi có người lớn hướng dẫn.

Trang là một tệp `index.html` tĩnh, không cần build.

## Giấy phép

Nội dung và mã trong repo này phát hành theo giấy phép [MIT](LICENSE).

Đoạn công thức trộn động cơ trong tab "Thử động cơ" trích từ [ESP-Drone](https://github.com/espressif/esp-drone) (`power_distribution_stock.c`), thuộc giấy phép GPL-3.0 của dự án đó. Module `ai_uart.c` được thiết kế để biên dịch cùng ESP-Drone, nên firmware sau khi build tuân theo GPL-3.0.
