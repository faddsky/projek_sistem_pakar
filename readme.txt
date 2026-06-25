Nama Kelompok : 5
Anggota :
1. Melania Intan Sagita - 123230005
2. Fadilah Nur Sabiyyah - 123230006

Judul Aplikasi : DigestCare - Sistem Pakar Deteksi Keracunan Makanan & Penyakit Pencernaan
Metode : Certainty Factor (CF)
Bahasa Pemrograman : JavaScript (Node.js & ES6)
Framework : React.js (Frontend) & Express.js (Backend)
Database : MySQL
Username Login : - (Tidak ada fitur login / Aplikasi bersifat publik untuk umum)
Password Login : - (Tidak ada fitur login / Aplikasi bersifat publik untuk umum)

Cara Menjalankan Program:
=========================

A. Persiapan Database (MySQL)
-----------------------------
1. Pastikan XAMPP (MySQL/MariaDB) atau service MySQL lokal Anda sudah berjalan.
2. Buka phpMyAdmin (http://localhost/phpmyadmin).
3. Buat database baru dengan nama:
   sistem_pakar_keracunan
4. Import berkas SQL  database yang terletak di:
   sistem_pakar_keracunan.sql (berada satu tingkat di luar direktori proyek)

B. Menjalankan Backend Server
----------------------------
1. Buka terminal/command prompt baru.
2. Arahkan ke direktori backend:
   cd backend
3. Jalankan instalasi dependensi (jika belum dilakukan):
   npm install
4. Pastikan file `.env` di dalam direktori `backend` sudah sesuai dengan konfigurasi database lokal:
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=sistem_pakar_keracunan
   PORT=5000
5. Jalankan server backend dengan perintah:
   node server.js
6. Jika berhasil, akan muncul log:
   "✅ Database Connection Pool Created"
   "🚀 Server running on http://localhost:5000"

C. Menjalankan Frontend Web App
------------------------------
1. Buka terminal/command prompt baru lainnya.
2. Arahkan ke direktori frontend:
   cd frontend
3. Jalankan instalasi dependensi (jika belum dilakukan):
   npm install
4. Jalankan aplikasi web React dengan perintah:
   npm start
5. Aplikasi akan otomatis terbuka di browser pada alamat:
   http://localhost:3000
