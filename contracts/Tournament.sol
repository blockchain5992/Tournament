// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.18;

contract Tournament {
    // counter variable for Tournament ID
    uint public counter;
    // Owner address init in constructor
    address public owner;

    struct TournamentDetail {
        // minimum user
        uint minUser;
        // registered user for specific tournament
        uint userCount;
        // bool value for status of touranament
        bool status;
    }

    struct PlayerDetail {
        // player tournament Id
        uint tournamentId;
        // player score
        uint score;
        // bool value
        bool isJoined;
    }

    // For Storing tournament details
    mapping(uint => TournamentDetail) public TournamentDetails;
    // For Storing player details
    mapping(address => mapping(uint => PlayerDetail)) public PlayerDetails;

    event TournamentAdded(uint counter, uint minUser);
    event UserJoined(uint id, uint count);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized Access");
        _;
    }

    function addTournament(uint _minUser) external onlyOwner {
        TournamentDetail storage TournamentInfo = TournamentDetails[counter];
        TournamentInfo.minUser = _minUser;
        emit TournamentAdded(counter, _minUser);
    }

    function joinTournament(uint id) external {
        PlayerDetail storage PlayerInfo = PlayerDetails[msg.sender][id];
        TournamentDetail storage TournamentInfo = TournamentDetails[counter];
        PlayerInfo.isJoined = true;
        TournamentInfo.userCount += 1;
        emit UserJoined(id, TournamentInfo.userCount);
    }

    function startTournament(uint id) external {
        TournamentDetail memory TournamentInfo = TournamentDetails[id];
        uint userCount = TournamentInfo.userCount;
        uint minUser = TournamentInfo.minUser;
        bool status = TournamentInfo.status;
        require(userCount > minUser, "Less User");
        require(!status, "Already Active");
        TournamentDetails[id].status = true;
    }

    function EndTournament(
        address[] calldata user,
        uint[] calldata score,
        uint id
    ) external onlyOwner {
        uint length = score.length;

        for (uint i = 0; i < length; ++i) {
            address player = user[i];
            PlayerDetail storage PlayerInfo = PlayerDetails[player][id];
            PlayerInfo.score = score[i];
        }
    }

    function getActiveTournaments() external view returns (uint[] memory) {
        uint i;
        uint j = counter;
        uint[] memory arr = new uint[](j);
        while (i < j) {
            if (TournamentDetails[i].status) {
                arr[i] = i;
            }
            i++;
        }
        return arr;
    }
}
