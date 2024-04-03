set -e

docker build -t ps-email-airdrop .
docker tag ps-email-airdrop ps-email-airdrop:latest
# docker save -o ps-email-airdrop.tar ps-email-airdrop:latest