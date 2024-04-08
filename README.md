# Apillon pre-built solution for NFT Email Airdrop

[![Twitter Follow](https://img.shields.io/twitter/follow/Apillon?style=social)](https://twitter.com/intent/follow?screen_name=Apillon)

Simplify your NFT distribution process by easily distributing digital collectibles (NFTs) to users using only their email addresses with our solution.

**Access an admin panel to:** - Add email addresses individually or in bulk via file upload. - Track successful and unsuccessful NFT deliveries, along with linked wallets. - Automate email notifications with claim instructions for recipients.

**Before getting started, ensure you have:**

- Created NFT collection using Apillon.
- Access to an email server's details.
- A specialized Ethereum wallet for admin panel access.
- Apillon API key and secret for connection.

**Options for deployment:**

- Run the front-end locally or host it on any website provider.
- Utilize Apillon's hosting service, with GitHub actions setup available.
- Run the back-end locally or via Docker, configuring files with collectible and email server details.

## Getting started

Solution consists of 2 main parts, Node.js backend APIs and Vue 3 frontend.

### Basic

If you have no experience with git and would still like to use our prebuilt solution, feel free to click the green button "Code" on the upper right corner of this repository and then selecting "Download ZIP".
Once downloaded, the zip file includes all files you need to run the application. Before that happens you need to set up configuration as described in documentation.

### Advanced

1. Fork the repo
2. Configure and modify APIs and website
3. Deploy API to docker or any other server that can run node.js applications
4. Deploy website to Apillon hosting

## Documentation

| Resource                       | Description              |
| ------------------------------ | ------------------------ |
| [Backend](backend/README.md)   | Docs for node.js backend |
| [Frontend](frontend/README.md) | Docs from Vue 3 frontend |

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.
