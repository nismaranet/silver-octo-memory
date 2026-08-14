# Dokumentasi Integrasi API Request Lagu (Nismara Radio)

Dokumen ini menjelaskan mekanisme teknis penerapan fitur _Song Request_ (Permintaan Lagu) publik menggunakan API AzuraCast pada halaman front-end. Mekanisme ini berjalan sepenuhnya di sisi klien (_Client-Side_) dan terbagi menjadi proses pengambilan daftar lagu serta pengiriman permintaan.

## 1. Prasyarat Sistem (Dashboard AzuraCast)

Sebelum API dapat mengembalikan data, fitur request wajib diaktifkan dari dalam _dashboard_ Nismara Radio:

1. Masuk ke menu **Profile Stasiun** (Station Profile).
2. Aktifkan opsi **Enable Public Requests**.
3. (Opsional) Atur parameter _Request Delay_ untuk mencegah _spam_ artis atau judul lagu yang sama dalam waktu berdekatan.

## 2. Arsitektur Endpoint API

Mekanisme ini menggunakan dua endpoint publik dari AzuraCast. Keduanya tidak memerlukan autentikasi token untuk akses dasar (publik).

- **Endpoint Ambil Daftar (GET):** `https://radio.nismara.web.id:8443/api/station/1/requests`
  - _Fungsi:_ Mengambil seluruh daftar lagu yang saat ini diizinkan oleh sistem untuk di-request.
- **Endpoint Kirim Request (POST):** `https://radio.nismara.web.id:8443/api/station/1/request/{request_id}`
  - _Fungsi:_ Mengirimkan ID unik lagu (`request_id`) agar dimasukkan ke dalam antrean _AutoDJ_.

_(Catatan: Angka `1` adalah Station ID. Sesuaikan jika Nismara menggunakan ID yang berbeda)._

## 3. Alur Kerja (Workflow) Mekanisme

### Tahap 1: Pengambilan Data & Rendering (GET)

Saat pengunjung membuka halaman radio, fungsi `fetchRequests()` dijalankan. Sistem akan mengambil _array_ daftar lagu dan merendernya ke dalam elemen list HTML (`<li>`).

Setiap item lagu dalam _array_ memiliki properti penting:

- `item.song.title` (Judul Lagu)
- `item.song.artist` (Artis)
- `item.request_id` (ID Unik untuk POST)

Tombol "Request" yang dirender pada setiap lagu akan disematkan fungsi _onclick_ yang membawa `request_id` tersebut.

### Tahap 2: Filter & Pencarian (Client-Side)

Untuk menghindari _lag_ akibat memanggil API setiap kali pengguna mengetik, pencarian dilakukan murni di sisi _browser_ (Client-Side Filtering). Data JSON awal yang didapat dari Tahap 1 disimpan dalam memori (`requestableSongs`), lalu disaring berdasarkan input pengguna.

```javascript
// Mekanisme Filter Pencarian
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = requestableSongs.filter(
    (item) =>
      item.song.title.toLowerCase().includes(keyword) ||
      item.song.artist.toLowerCase().includes(keyword),
  );
  renderRequests(filtered); // Render ulang list berdasarkan hasil filter
});
```
