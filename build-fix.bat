# Disable Spectre mitigation for node-pty build
npm config set msvs_version 2022
npm install --node-pty-prebuilt=true
