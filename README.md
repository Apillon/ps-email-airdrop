# Apillon pre-built solution for NFT Email Airdrop

This ready-made solution is designed to help you give out digital collectibles (called NFTs) to users, even if you only have their email addresses.

**Once you set it up, you'll have a special page (called an admin panel) where you can control the NFT airdrop:**
-   Add email addresses one by one.
-   Upload a file with lots of email addresses at once.
-   See which email addresses got the NFTs successfully and which didn't.
-   You can also see which wallets are linked to each email.
-   The system will automatically send an email to each address with instructions and a link to a page where they can claim their NFT.
    
**Before you start, you'll need a few things ready:**
1.  You need to create your digital collectibles using a tool called Apillon.
2.  You need to know the details of an email server, like where it's located and its address.
3.  You'll need a special wallet that works with Ethereum (a type of cryptocurrency) to access the admin panel.
4.  You'll also need an Apillon API key and secret, which are like special codes to connect to Apillon.
    
**Here's how the system is set up:**
1.  The front-end (what users see) is made with Vue.js.
2.  The back-end (the behind-the-scenes stuff) is made with Node.js, and it stores information in a MySQL database.
    
**You have a few options for running the system:**
-   You can run the front-end on your computer.
-   You can host it on any website provider.
-   Or, you can use Apillon's hosting service. There's even a special setup for this using GitHub actions.
-   For the back-end part, you can run it on your computer or using a tool called Docker. You just need to set up some configuration files with the right information, like the details of your digital collectibles and your email server. All the instructions for this are available on GitHub.

## Backend

See [backend docs](/backend/README.md).

## Frontend

See [frontend docs](/frontend/README.md).
