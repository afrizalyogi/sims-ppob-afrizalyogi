# 📝 SIMS PPOB - Afrizal Yogi

Aplikasi *Payment Point Online Bank (PPOB)* berbasis *Website* untuk transaksi *Top Up*, Pembayaran, dan manajemen akun, dikembangkan menggunakan **React.js** dan **Redux Toolkit**.

## 🌟 Fitur Utama Aplikasi

Proyek ini telah mengimplementasikan inti dari fitur-fitur wajib:

1.  **Registrasi**: Pendaftaran akun baru dengan validasi form.
2.  **Login**: Autentikasi pengguna dan persistensi *session* (**Bearer Token**).
3.  **Halaman Utama (Home)**: Menampilkan data profil, saldo (**BalanceCard**), daftar layanan (**ServiceIcon**), dan *banner* promo (**PromoBanner**).
4.  **Lihat Profile**: Menampilkan data profil dan saldo terkini.
5.  **Update Profile Data**: Mengubah Nama Depan dan Belakang.
6.  **Update Profile Picture**: Mengunggah foto profil baru (maksimal 100 KB).
7.  **Logout**: Menghapus sesi dan mengarahkan ke halaman Login.


---


## 🛠️ Tech Stack & Requirements

| Kategori | Teknologi | Fungsi |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | Kerangka kerja utama antarmuka pengguna. |
| **State Management** | Redux Toolkit (RTK) | Menggunakan **`buildCreateSlice`** untuk *async thunks* modern dan TypeScript. |
| **Styling** | Tailwind CSS | Kerangka kerja CSS utilitas untuk *styling* cepat. |
| **Routing** | React Router v7 | Pengelolaan navigasi dan **Protected Routes**. |
| **Form Management**| Formik & Yup | Pengelolaan *state* form dan validasi skema deklaratif. |
| **API Client** | Axios (di file `Api.ts`) | Klien HTTP untuk interaksi API, termasuk **Interceptor Token** otomatis. |
| **Bahasa** | TypeScript | Menjamin keamanan tipe dan kualitas kode. |


---


## 🚀 Instalasi & Menjalankan Proyek

Ikuti langkah berikut untuk menyiapkan dan menjalankan aplikasi.

### Prasyarat

* **Node.js** (Versi 22/LTS direkomendasikan)
* **npm** atau **Yarn**

### Langkah-Langkah

1.  **Clone Repository**
    ```bash
    git clone https://github.com/afrizalyogi/sims-ppob-afrizalyogi
    cd sims-ppob-afrizalyogi
    ```

2.  **Instal Dependensi**
    ```bash
    npm install
    # Termasuk @reduxjs/toolkit, react-redux, react-router-dom, axios, formik, dan yup
    ```

3.  **Jalankan Aplikasi**
    ```bash
    npm run dev
    ```
    Aplikasi akan terbuka di *browser* pada `http://localhost:5173`.


---


## 🔒 Konsep Arsitektur Utama

### 1. **Redux Toolkit Modernitas**
* Semua *thunk* didefinisikan secara internal menggunakan **`createAppSlice`** (`buildCreateSlice`), yang menyederhanakan *state loading/error/success* (*pending/fulfilled/rejected*) secara signifikan.
* Digunakan **Typed Hooks** (`useAppSelector`, `useAppDispatch`) untuk keamanan tipe di seluruh komponen.

### 2. **Authentication Flow**
* **Persistent Session**: Token disimpan di `localStorage` setelah *login*.
* **Otomasi Header**: File `Api.ts` secara otomatis menyuntikkan token yang tersimpan ke dalam *header* `Authorization: Bearer <token>` untuk setiap permintaan yang memerlukan akses terproteksi.

### 3. **Validasi Form Ketat**
* Form **Registrasi** dan **Login** menggunakan **Formik** dan **Yup** untuk validasi deklaratif.
* Validasi *email* diperketat dengan `.matches()` dan daftar TLD yang diizinkan untuk menghindari domain yang tidak valid.


---


## 💻 Referensi API (SIMS PPOB)

Semua panggilan API dilakukan melalui *instance* **`Api`** yang telah dikonfigurasi.

| Fitur | Method | Endpoint | Redux Thunk |
| :--- | :--- | :--- | :--- |
| **Login** | `POST` | `/login` | `login` |
| **Registrasi** | `POST` | `/registration` | `registration` |
| **Lihat Profile**| `GET` | `/profile` | `getProfile` |
| **Lihat Saldo** | `GET` | `/balance` | `getBalance` |
| **Update Data** | `PUT` | `/profile/update` | `updateProfileData` |
| **Update Gambar** | `PUT` | `/profile/image` | `updateProfilePicture` |
| **Layanan** | `GET` | `/services` | `getServices` |
| **Banner** | `GET` | `/banner` | `getBanners` |


---
