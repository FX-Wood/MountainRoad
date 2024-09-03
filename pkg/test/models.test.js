const expect = require('chai').expect
const should = require('chai').should()
const mongoose = require('mongoose')


mongoose.connect('mongodb://localhost/project4test', {useNewUrlParser: true});
const db = mongoose.connection;

describe('user model', async function() {
    const User = require('../models/user')
    it('user imports correctly', function() {
        expect(typeof User).to.not.equal('undefined')
    })
    it('writes valid user to db', async function() {
        const testUser = new User({
            email: 'fx@fx.codes',
            password: 'password()',
        })
        try {
            await testUser.save()
            let query = await User.findOne({where: {email:'fx@fx.codes'}}).exec()
            console.log('query',query)
            return Promise.resolve(expect(query.email).to.equal('fx@fx.codes'))
        } catch(err) {
            // return Promise.reject(err)
        } 

    })
    // it('profile', function() {
    //     expect(typeof user.profile).to.not.equal('undefined')
    // })
})

mongoose.connection.close()