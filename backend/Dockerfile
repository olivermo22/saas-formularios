FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo los archivos necesarios para instalar dependencias
COPY package.json package-lock.json* ./

# Instalamos solo dependencias de producción
RUN npm install --omit=dev

# Copiamos el código fuente
COPY src ./src

# Puerto interno del contenedor
ENV PORT=8080
EXPOSE 8080

# Comando de arranque
CMD ["npm", "start"]

