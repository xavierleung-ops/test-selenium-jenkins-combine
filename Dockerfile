FROM --platform=linux/amd64 node:20

# Install system dependencies
RUN apt-get update -y && apt-get install -y wget unzip tzdata \
    && rm -rf /var/lib/apt/lists/*
ARG DEBIAN_FRONTEND=noninteractive

# Install Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
RUN apt-get update
RUN apt-get install -y google-chrome-stable
RUN echo $(google-chrome --version)
RUN echo $(which google-chrome)

# # Install ChromeDriver
# ARG CHROME_DRIVER_VERSION=114.0.5735.90
# RUN wget -N "https://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip" -P ~/
# RUN unzip ~/chromedriver_linux64.zip -d ~/
# RUN rm ~/chromedriver_linux64.zip
# RUN mv -f ~/chromedriver /usr/local/bin/chromedriver
# RUN chmod +x /usr/local/bin/chromedriver
# RUN echo $(chromedriver --version)
# RUN echo $(which chromedriver)

# Install Firefox
RUN apt-get install -y firefox-esr

# # Install GeckoDriver
# ARG GECKODRIVER_VERSION=0.31.0
# RUN wget --no-verbose -O /tmp/geckodriver.tar.gz "https://github.com/mozilla/geckodriver/releases/download/v$GECKODRIVER_VERSION/geckodriver-v$GECKODRIVER_VERSION-linux64.tar.gz"
# RUN tar -C /opt -zxf /tmp/geckodriver.tar.gz
# RUN rm /tmp/geckodriver.tar.gz
# RUN mv /opt/geckodriver /opt/geckodriver-$GECKODRIVER_VERSION
# RUN chmod 755 /opt/geckodriver-$GECKODRIVER_VERSION
# RUN ln -fs /opt/geckodriver-$GECKODRIVER_VERSION /usr/bin/geckodriver

# Set environment variable
ENV BROWSER='chrome'

# Install Node.js packages
COPY package.json .
RUN yarn
RUN echo $(npm list chromedriver)

# Copy application source
COPY . .

RUN echo $(ls)

# Set the entrypoint
ENTRYPOINT ["yarn", "selenium_test"]
