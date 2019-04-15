const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const profileSchema = new Schema({
    firstName: String,
    lastName: String,
    skier: Boolean,
    snowboarder: Boolean,
    timestamp: true

})
profileSchema.virtual('fullName')
    .get(function() {
        return this.firstName + this.lastName
    })

mongoose.model('Profile', profileSchema)
const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'You must enter a password'],
        minlength: [10, 'Your password must be between 10 and 128 characters'],
        maxlength: [128, 'Your password must be between 10 and 128 characters']
    },
    email: {
        type: String,
        required: [true, 'You must enter an email'],
        minlength: [6, 'Your email must be between 5 and 99 characters'],
        maxlength: [128, 'Your email must be between 1 and 99 characters'],
        validate: {
            validator: function(v) {
                return /.+@.+\..+/.test(v)
            },
            message: props => `${props.value} is not a valid email`
        }
    },
    profile: profileSchema
})

userSchema.virtual('safe')
    .get(function() {
        return {
            id: this._id,
            email: this.email,
            profile: this.profile,
        }
    })
    
// helper function to strip secrets from the user instance
userSchema.set('toObject', {
    transform: function(doc, ret, options) {
        let returnJson = {
            _id: ret._id,
            email: ret.email,
            name: ret.name
        }
        return returnJson;
    }
})

// compares passwords
userSchema.methods.authenticated = function(password) {
    console.log('comparing passwords', password, this.password)
    return bcrypt.compareSync(password, this.password);
}

// hashes passwords before saving to the database
userSchema.pre('save', function(next) {
    console.log('presave', this)
    if (this.isNew) {
        console.log('this.password', this.password)
        let hash = bcrypt.hashSync(this.password, 12);
        console.log('hash', hash)
        this.password = hash;
        console.log('this', this)
    }
    next();
})

module.exports = mongoose.model('User', userSchema);