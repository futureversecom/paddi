FROM public.ecr.aws/bitnami/node:18

WORKDIR /build

# Cypress Dependencies. No need for now
# https://docs.cypress.io/guides/continuous-integration/introduction#Dependencies
# RUN apt-get update
# RUN apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb curl

# Codecov uploader for coverage reporting
RUN curl -Os https://uploader.codecov.io/latest/linux/codecov \
  && chmod +x codecov

# Install foundry
RUN curl -L https://foundry.paradigm.xyz | bash
ENV PATH "$PATH:/root/.foundry/bin"
RUN foundryup

# Install chrome
RUN apt-get update && apt-get install -y gnupg2
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb https://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update -qq \
  && apt-get install -qq --no-install-recommends \
  google-chrome-stable \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN ["npm", "install", "-g", "yarn"]

COPY ["./package.json", "./yarn.lock", "./"]
COPY ./packages ./packages

# Find and remove non-package.json files
RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -print | xargs rm -rf

RUN ["env", "NOYARNPOSTINSTALL=1", "PERCY_POSTINSTALL_BROWSER=true", "yarn", "install", "--network-timeout 100000", "--frozen-lockfile"]
