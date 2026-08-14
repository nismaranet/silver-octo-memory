# Dokumentasi Integrasi API AzuraCast (Nismara Radio)

Dokumen ini memuat penjelasan teknis mengenai mekanisme penerapan API AzuraCast secara _real-time_ pada framework web berbasis statis (Astro), lengkap dengan pemutar audio khusus siaran langsung (_live broadcast_).

## 1. Arsitektur Endpoint API

Mekanisme ini memanfaatkan API publik dari AzuraCast yang secara _default_ disediakan tanpa memerlukan token autentikasi khusus untuk membaca data _Now Playing_.

- **Endpoint Utama:** `https://radio.nismara.web.id:8443/api/nowplaying/1`
- **Method:** `GET`
- **Format Respons:** JSON
- **Mount Point Audio:** `https://radio.nismara.web.id:8443/listen/1/radio.mp3`

_(Catatan: Angka `1` pada URL mewakili ID Stasiun. Jika instalasi Nismara Radio memiliki lebih dari satu stasiun, angka ini perlu disesuaikan)._

## 2. Mekanisme Polling (Client-Side Fetching)

Karena halaman web dibangun menggunakan Astro yang berfokus pada kecepatan _static site_, pengambilan data tidak dilakukan pada sisi server saat proses _build_ (Frontmatter/Server-Side Rendering), melainkan menggunakan **Client-Side Polling**.

### Alur Kerja Fetching:

1.  **Inisialisasi Pertama:** Saat pengunjung membuka halaman `/radio`, fungsi `updateNowPlaying()` langsung dijalankan satu kali untuk memuat data secara instan sebelum pemutar audio disentuh.
2.  **Interval Rutin:** Fungsi `setInterval(updateNowPlaying, 10000)` digunakan untuk memicu permintaan API (GET) setiap 10 detik (10.000 milidetik).
3.  **Pencegahan Flicker DOM:** Agar elemen HTML tidak berkedip setiap 10 detik, sistem melakukan validasi komparasi. Teks judul lagu di DOM hanya akan diperbarui (dirender ulang) jika judul lagu baru yang didapat dari API berbeda dengan judul lagu yang sedang tayang di layar.

```javascript
// Contoh Logika Anti-Flicker
if (titleEl && titleEl.innerText !== nowPlaying.title) {
  titleEl.innerText = nowPlaying.title;
  artistEl.innerText = nowPlaying.artist;
  coverEl.src = nowPlaying.art;
}
```
