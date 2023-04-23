const ContractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_minUser",
				"type": "uint256"
			}
		],
		"name": "addTournament",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "user",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "score",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "endTournament",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "joinTournament",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "startTournament",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "counter",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "minUser",
				"type": "uint256"
			}
		],
		"name": "TournamentAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"name": "UserJoined",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "counter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getActiveTournaments",
		"outputs": [
			{
				"internalType": "bool[]",
				"name": "",
				"type": "bool[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "PlayerDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isJoined",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "TournamentDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "minUser",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "userCount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "status",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "isFinished",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

module.exports = {
	ContractABI
}