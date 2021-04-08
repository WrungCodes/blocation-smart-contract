// const { assert } = require("chai")
const _deploy_contracts = require("../migrations/2_deploy_contracts")
const truffleAssert = require('truffle-assertions');

const Blocation = artifacts.require("Blocation");

contract('Blocation', (accounts) => {
    var token;

    const user1 = accounts[3];
    const user2 = accounts[2];
    const anotheruser = accounts[5];

    it('initializes contracts', async () => {
        token = await Blocation.deployed()
        assert.notEqual(token.address, 0x0, 'has contract address')
    })

    it('can create Blocation', async () => {
        tokenResponse = await token.createBlocation('PlaceHolder', '13.3', '56', {from: user1})
        count = await token.totalTokenSuppy();

        assert.equal(count.toNumber(), 1, 'Blocation was created')
    })

    it('can get Blocation', async () => {
        loc = await token.getBlocation(1, {from: user1})
        assert.equal(loc, 'PlaceHolder|13.3|56', 'can get Blocation which was created')
    })

    it('cannot let another user get Blocation', async () => {

        truffleAssert.reverts(
            token.getBlocation(1, {from: user2}),
            null,
            "ERC721: token doesn't belong to you"
        );
    })

    it('can get list Blocation tokenIds', async () => {
        tokenResponse = await token.createBlocation('NewPlaceHolder', '15.3', '26', {from: user1})
        list = await token.blocationsOfOwner({from: user1})
        assert.equal(list.length, 2, 'Blocation was created')
    })

    it('cannot allow another address transfer Blocation', async () => {
        truffleAssert.reverts(
            token.transferBlocation(anotheruser, 1, {from: user2}),
            null,
            'player does not own the token'
        );
    })

    it('can allow owner address transfer Blocation', async () => {
        transfer = await token.transferBlocation(anotheruser, 1, {from: user1})

        truffleAssert.eventEmitted(transfer, 'Transfer', (ev) => {
            assert.equal(user1, ev.from, 'sender matches')
            assert.equal(anotheruser, ev.to, 'reciever matches')
            assert.equal(1, ev.tokenId, 'tokenid matches')
            return true;
        }, 'transfer event is emitted');

        owner = await token.ownerOf(1);
        assert.equal(owner, anotheruser, 'Blocation switched owner')

        truffleAssert.reverts(
            token.transferBlocation(user1, 1, {from: user2}),
            null,
            'player does not own the token again'
        );
    })
})