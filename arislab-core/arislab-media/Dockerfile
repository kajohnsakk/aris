FROM ubuntu:18.04

COPY ./ /root
WORKDIR /root

# Install fonts
COPY ./media/public/fonts/angsana_new.ttf /usr/share/fonts/truetype/angsana_new.ttf
RUN apt update && apt install -y fontconfig && fc-cache -f -v

# Install OS Packages
RUN apt update && apt install -y \
    curl \
    software-properties-common \
    sudo

# Install NODE 8.X
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN apt install -y \
    nodejs 

# Install ffmpeg
RUN add-apt-repository -y ppa:jonathonf/ffmpeg-4
RUN apt update && apt install -y \
    libxcomposite-dev \
    libxtst6 \
    libnss3-dev \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libavutil-dev \
    ffmpeg
# procps

RUN npm install
RUN npm run build

CMD ["npm", "start"]