const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Tournament", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTournamentFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Tournament = await ethers.getContractFactory("Tournament");
    const tournament = await Tournament.deploy();

    return { tournament, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the deployer as owner", async function () {
      const { owner, tournament } = await loadFixture(deployTournamentFixture);

      expect(await tournament.owner()).to.equal(owner.address);
    });
  });

  describe("addTournament", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called from another account", async function () {
        const { tournament, otherAccount } = await loadFixture(
          deployTournamentFixture
        );

        let minUser = 10;

        await expect(
          tournament.connect(otherAccount).addTournament(minUser)
        ).to.be.revertedWith("Unauthorized Access");
      });

      it("Should revert with the right error if call with zero user", async function () {
        const { tournament } = await loadFixture(deployTournamentFixture);

        let minUser = 0;

        await expect(tournament.addTournament(minUser)).to.be.revertedWith(
          "Can't be Zero"
        );
      });

      it("Shouldn't fail if the owner calls addTournament", async function () {
        const { tournament } = await loadFixture(deployTournamentFixture);
        let minUser = 10;

        // Transactions are sent using the first signer by default
        await expect(tournament.addTournament(minUser)).not.to.be.reverted;
        let counter = await tournament.counter();
        let tournamentInfo = await tournament.TournamentDetails(counter - 1);
        let User = await tournamentInfo.minUser;
        expect(minUser).to.equal(User);
      });
    });

    describe("Events", function () {
      it("Should emit an event on addTournament", async function () {
        const { tournament } = await loadFixture(deployTournamentFixture);
        let minUser = 10;
        let counter = await tournament.counter();

        await expect(tournament.addTournament(minUser))
          .to.emit(tournament, "TournamentAdded")
          .withArgs(counter, minUser); // We accept any value as `when` arg
      });
    });
  });

  describe("joinTournament", function () {
    it("Should join the tournament by player", async function () {
      const { tournament, otherAccount } = await loadFixture(
        deployTournamentFixture
      );
      let minUser = 10;
      let id = 0;
      await tournament.addTournament(minUser);
      await expect(tournament.connect(otherAccount).joinTournament(id)).to.emit(
        tournament,
        "UserJoined"
      );
      let tournamentInfo = await tournament.TournamentDetails(id);
      let count = tournamentInfo.userCount;
      expect(count).to.equal(1);
    });

    it("Should revert if id greater than counter", async function () {
      const { tournament, otherAccount } = await loadFixture(
        deployTournamentFixture
      );
      let minUser = 10;
      let id = 1;
      await expect(tournament.addTournament(minUser)).not.to.be.reverted;
      await expect(
        tournament.connect(otherAccount).joinTournament(id)
      ).to.be.revertedWith("Invalid Id");
    });

    it("Should revert if try to join already joined tournament", async function () {
      const { tournament, otherAccount } = await loadFixture(
        deployTournamentFixture
      );
      let minUser = 10;
      let id = 0;
      await expect(tournament.addTournament(minUser)).not.to.be.reverted;
      await tournament.connect(otherAccount).joinTournament(id);
      await expect(
        tournament.connect(otherAccount).joinTournament(id)
      ).to.be.revertedWith("Already joined");
    });

    it("Should revert if tournament already started", async function () {
      const { tournament, otherAccount } = await loadFixture(
        deployTournamentFixture
      );
      let minUser = 1;
      let id = 0;
      await expect(tournament.addTournament(minUser)).not.to.be.reverted;
      await expect(tournament.joinTournament(id)).not.to.be.reverted;
      await expect(tournament.startTournament(id)).not.to.be.reverted;
      await expect(tournament.joinTournament(id)).to.be.revertedWith(
        "Already Started"
      );
    });
  });

  describe("startTournament", function () {
    it("Should start the tournament", async function () {
      const { tournament, otherAccount } = await loadFixture(
        deployTournamentFixture
      );
      let minUser = 1;
      let minUser2 = 10;
      let id = 0;
      await expect(tournament.addTournament(minUser)).not.to.be.reverted;
      await expect(tournament.addTournament(minUser)).not.to.be.reverted;
      await expect(tournament.connect(otherAccount).joinTournament(id)).to.emit(
        tournament,
        "UserJoined"
      );
      await expect(tournament.startTournament(id)).not.to.be.reverted;
      await tournament.getActiveTournaments();
    });

    it("Should revert if minUser count not reached", async function () {
      const { tournament, otherAccount } = await loadFixture(
        deployTournamentFixture
      );
      let minUser = 10;
      let id = 0;
      await expect(tournament.addTournament(minUser)).not.to.be.reverted;
      await expect(
        tournament.connect(otherAccount).startTournament(id)
      ).to.be.revertedWith("Less User");
    });

    it("Should revert if tournament already started", async function () {
      const { tournament, otherAccount } = await loadFixture(
        deployTournamentFixture
      );
      let minUser = 1;
      let id = 0;
      await expect(tournament.addTournament(minUser)).not.to.be.reverted;
      await expect(tournament.connect(otherAccount).joinTournament(id)).not.to
        .be.reverted;
      await expect(tournament.connect(otherAccount).startTournament(id)).not.to
        .be.reverted;
      await expect(
        tournament.connect(otherAccount).startTournament(id)
      ).to.be.revertedWith("Already Started");
    });
  });
  describe("endTournament", function () {
    it("Should end the tournament by owner", async function () {
      const { tournament, otherAccount } = await loadFixture(
        deployTournamentFixture
      );
      let minUser = 1;
      let id = 0;
      let user = [otherAccount.address];
      let score = [5];
      await expect(tournament.addTournament(minUser)).not.to.be.reverted;
      await expect(tournament.connect(otherAccount).joinTournament(id)).to.emit(
        tournament,
        "UserJoined"
      );
      await expect(tournament.startTournament(id)).not.to.be.reverted;
      await expect(tournament.endTournament(user, score, id))
        .to.emit(tournament, "TournamentEnded")
        .withArgs(id);
      let tournamentInfo = await tournament.TournamentDetails(id);
      let isFinish = tournamentInfo.isFinished;
      expect(isFinish).to.equal(true);
    });

    it("Should revert if endTournament by non-owner", async function () {
      const { tournament, otherAccount } = await loadFixture(
        deployTournamentFixture
      );
      let minUser = 1;
      let id = 0;
      let user = [otherAccount.address];
      let score = [5];
      await expect(tournament.addTournament(minUser)).not.to.be.reverted;
      await expect(tournament.connect(otherAccount).joinTournament(id)).not.to
        .be.reverted;
      await expect(tournament.connect(otherAccount).startTournament(id)).not.to
        .be.reverted;
      await expect(
        tournament.connect(otherAccount).endTournament(user, score, id)
      ).to.be.revertedWith("Unauthorized Access");
    });

    it("Should revert if Tournament is not yet started", async function () {
      const { tournament, otherAccount } = await loadFixture(
        deployTournamentFixture
      );
      let minUser = 1;
      let id = 0;
      let user = [otherAccount.address];
      let score = [5];
      await expect(tournament.addTournament(minUser)).not.to.be.reverted;
      await expect(tournament.connect(otherAccount).joinTournament(id)).not.to
        .be.reverted;
      await expect(
        tournament.endTournament(user, score, id)
      ).to.be.revertedWith("Not Active");
    });

    it("Should revert if Tournament already finished", async function () {
      const { tournament, otherAccount } = await loadFixture(
        deployTournamentFixture
      );
      let minUser = 1;
      let id = 0;
      let user = [otherAccount.address];
      let score = [5];
      await expect(tournament.addTournament(minUser)).not.to.be.reverted;
      await expect(tournament.connect(otherAccount).joinTournament(id)).not.to
        .be.reverted;
      await expect(tournament.startTournament(id)).not.to.be.reverted;
      await tournament.endTournament(user, score, id);
      await expect(
        tournament.endTournament(user, score, id)
      ).to.be.revertedWith("Already Finished");
    });

    it("Should revert if scores and users length are not equal", async function () {
      const { tournament, otherAccount } = await loadFixture(
        deployTournamentFixture
      );
      let minUser = 1;
      let id = 0;
      let user = [otherAccount.address];
      let score = [5];
      await expect(tournament.addTournament(minUser)).not.to.be.reverted;
      await expect(tournament.connect(otherAccount).joinTournament(id)).not.to
        .be.reverted;
      await expect(tournament.connect(otherAccount).startTournament(id)).not.to
        .be.reverted;
      await expect(
        tournament.connect(otherAccount).endTournament(user, score, id)
      ).to.be.revertedWith("Unauthorized Access");
    });

    it("Should revert if scores length are not equal", async function () {
      const { tournament, otherAccount } = await loadFixture(
        deployTournamentFixture
      );
      let minUser = 1;
      let id = 0;
      let user = [otherAccount.address];
      let score = [5, 10];
      await expect(tournament.addTournament(minUser)).not.to.be.reverted;
      await expect(tournament.connect(otherAccount).joinTournament(id)).not.to
        .be.reverted;
      await expect(tournament.connect(otherAccount).startTournament(id)).not.to
        .be.reverted;
      await expect(
        tournament.endTournament(user, score, id)
      ).to.be.revertedWith("Invalid Length");
    });
  });
});
