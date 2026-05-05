/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palet warna "Lucu tapi Profesional"
        'soft-pink': '#FFF0F3',    // Pink sangat muda untuk background
        'sweet-pink': '#FFB3C1',   // Pink pastel untuk aksen lembut
        'deep-pink': '#FB6F92',    // Pink tegas untuk tombol/judul agar terbaca jelas
        'pro-purple': '#8E9AAF',   // Abu-abu keunguan untuk teks agar profesional
        'soft-lavender': '#F0E6EF' // Lavender muda untuk variasi card
      },
      fontFamily: {
        // Menggunakan font yang bersih dan modern
        'sans': ['Quicksand', 'Nunito', 'sans-serif'],
      },
      borderRadius: {
        'xl-plus': '2rem', 
      }
    },
  },
  plugins: [],
}