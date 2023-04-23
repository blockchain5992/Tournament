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
        // bool value for status of tournament i.e NotStarted/Started
        bool status;
        // bool value for tracking finish
        bool isFinished;
    }

    struct PlayerDetail {
        // player score as per tournament Id
        uint score;
        // bool value for tracking joining
        bool isJoined;
    }

    // For Storing tournament details
    mapping(uint => TournamentDetail) public TournamentDetails;
    // For Storing player details as per tournament ID
    mapping(address => mapping(uint => PlayerDetail)) public PlayerDetails;

    event TournamentAdded(uint indexed counter, uint minUser);
    event UserJoined(uint indexed id, uint count);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized Access");
        _;
    }

    function addTournament(uint _minUser) external onlyOwner {
        require(_minUser > 0, "Can't be Zero");
        TournamentDetail storage TournamentInfo = TournamentDetails[counter];
        TournamentInfo.minUser = _minUser;
        counter++;
        emit TournamentAdded(counter - 1, _minUser);
    }

    function joinTournament(uint id) external {
        TournamentDetail memory TournamentMemInfo = TournamentDetails[id];
        require(id < counter, "Invalid Id");
        require(!TournamentMemInfo.isFinished, "Already Finished");
        require(!TournamentMemInfo.status, "Already Started");
        require(!PlayerDetails[msg.sender][id].isJoined, "Already joined");
        PlayerDetail storage PlayerInfo = PlayerDetails[msg.sender][id];
        TournamentDetail storage TournamentInfo = TournamentDetails[id];
        PlayerInfo.isJoined = true;
        TournamentInfo.userCount += 1;
        emit UserJoined(id, TournamentInfo.userCount);
    }

    function startTournament(uint id) external {
        TournamentDetail memory TournamentInfo = TournamentDetails[id];
        require(
            TournamentInfo.userCount >= TournamentInfo.minUser,
            "Less User"
        );
        require(!TournamentInfo.status, "Already Started");
        TournamentDetails[id].status = true;
    }

    function endTournament(
        address[] calldata user,
        uint[] calldata score,
        uint id
    ) external onlyOwner {
        TournamentDetail memory TournamentMemInfo = TournamentDetails[id];
        require(TournamentMemInfo.status, "Not Active");
        require(!TournamentMemInfo.isFinished, "Already Finished");
        uint scoreLength = score.length;
        uint userLength = user.length;
        require(scoreLength == userLength, "Invalid Length");
        for (uint i = 0; i < scoreLength; ++i) {
            address player = user[i];
            PlayerDetail storage PlayerInfo = PlayerDetails[player][id];
            PlayerInfo.score = score[i];
        }
        TournamentDetails[id].isFinished = true;
    }

    function getActiveTournaments() external view returns (bool[] memory) {
        uint i = 0;
        uint j = counter;
        bool[] memory arr = new bool[](j);
        while (i < j) {
            TournamentDetail memory TournamentInfo = TournamentDetails[i];
            if (TournamentInfo.status && !(TournamentInfo.isFinished)) {
                arr[i] = true;
            }
            i++;
        }
        return arr;
    }
}
