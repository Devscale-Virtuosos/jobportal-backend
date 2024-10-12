# Menggunakan image Bun.js sebagai base image
FROM node:latest

# Menetapkan direktori kerja di dalam container
WORKDIR /app

# Menyalin package.json dan pnpm-lock.yaml (jika ada)
COPY package*.json pnpm-lock.yaml ./

# Menginstall global dependencies (bun, pnpm & typescript)
RUN npm install -g bun
RUN npm install -g pnpm@latest
RUN npm install -g typescript

# Menginstall dependensi menggunakan pnpm
RUN pnpm install

# Menyalin seluruh kode sumber ke dalam container
COPY . .

# Build applikasi
RUN pnpm build

# Menentukan port yang akan digunakan oleh aplikasi
EXPOSE 8080

# Menjalankan aplikasi
CMD ["pnpm", "run", "start"]