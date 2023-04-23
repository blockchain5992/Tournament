// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const Web3 = require("web3");
const fs = require("fs");
const dotenv = require("dotenv");
const Provider = require("@truffle/hdwallet-provider");
const CONTRACT_ABI = require("./ContractABI/config");

// Load environment variables
dotenv.config();

// Load contract ABI and address

const privatekey = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;
const address = process.env.ADDRESS;
const rpcurl = process.env.RPC_URL;
const provider = new Provider(privatekey, rpcurl);
const web3 = new Web3(provider);
const tournamentContract = new web3.eth.Contract(
  CONTRACT_ABI.ContractABI,
  contractAddress
);

// Create express app
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define API routes
app.get("/tournament/getActiveTournaments", async (req, res) => {
  try {
    const activeTournaments = await tournamentContract.methods
      .getActiveTournaments()
      .call();
    res.send(activeTournaments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/tournament/getScoreCard", async (req, res) => {
  const { body } = req;
  const userAddress = body.userAddress;
  const id = body.id;

  try {
    const scoreCard = await tournamentContract.methods
      .PlayerDetails(userAddress)(id)
      .call();
    res.send(scoreCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
  
  // Save the response in a JSON file
//   const data = { account, balance };
//   const filename = `${account}.json`;
//   fs.writeFile(filename, JSON.stringify(data), (err) => {
//     if (err) console.error(err);
//     console.log(`Data written to ${filename}`);
//   });
});

app.post("/tournament/addTournament", async (req, res) => {
  const { body } = req;
  console.log(body.minUser);
  try {
    const accounts = process.env.ADDRESS;
    const result = await tournamentContract.methods
      .addTournament(body.minUser)
      .send({ from: accounts });
    console.log("result:", result);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/tournament/joinTournament", async (req, res) => {
  const { body } = req;
  const id = body.id;
  try {
    const accounts = process.env.ADDRESS;
    const result = await tournamentContract.methods
      .joinTournament(id)
      .send({ from: accounts });
    console.log("result:", result);
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/tournament/startTournament", async (req, res) => {
  const { body } = req;
  const id = body.id;
  try {
    const accounts = process.env.ADDRESS;
    const result = await tournamentContract.methods
      .startTournament(id)
      .send({ from: accounts });
    console.log("result:", result);
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/tournament/endTournament", async (req, res) => {
  const { body } = req;
  const users = body.users;
  const scores = body.scores;
  const id = body.id;
  try {
    const accounts = process.env.ADDRESS;

    const result = await tournamentContract.methods
      .endTournament(users, scores, id)
      .send({ from: accounts });
    console.log("result:", result);
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Start server
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
