import React, { Component } from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';
import SignUpInitialForm from '../components/SignUpInitialForm';
import SignUpProfileForm from '../components/SignUpProfileForm';
import Grid from '@material-ui/core/Grid';
import Typeography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    signup: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '24px'
    }
})

class SignupFlow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            first: '',
            last: '',
            profilePicture: null,
            skier: false,
            snowboarder: false,
            complicated: false,
            homeMountain: ''
        }
        this.handleCheckbox = this.handleCheckbox.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
        this.submitSignup = this.submitSignup.bind(this)
    }

    handleChange(e) {
        console.log('handling change', e.target, this)
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleCheckbox(e) {
        this.setState({
            [e.target.name]: e.target.checked
        })
    }

    handleFileChange(e) {
        console.log('handling file change', e.target.files, this)
        console.log('name', e.target.name)
        console.log('value', e.target.value)
        URL.revokeObjectURL(this.state[e.target.name])
        const blob = URL.createObjectURL(e.target.files[0])
        console.log(blob)
        this.setState({
            [e.target.name]: blob
        })
    }

    async submitSignup(e) {
        console.log('signing up...')
        e.preventDefault()

        const profilePicture = await ((url) => {
            return axios.get(url, { responseType: 'arraybuffer' })
            .then(response => {
                console.log(response.data)
                return new File(response.data)
            })
        })(this.state.profilePicture)
        axios.post('/auth/signup', this.state)
        .then( res => {
            console.log('res.data', res.data)
            if (res.data.type === 'error') {
                console.log('error', res.data)
                this.setState({
                    message: res.data.message
                })
            } else {
                console.log('res.data', res.data)
                console.log('token', res.data.token)
                localStorage.setItem('jwtToken', res.data.token)
                this.props.liftToken(res.data)
    
            }
        }).catch(err => {
            console.log(err, err.response, err.status)
            console.log('catching error')
            let message;
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                message = `${err.response.status}: ${err.response.data.message || err}`
            } else if (err.request) {
                // The request was made but no response was received
                console.log(err.request)
                message = '404: server not found'
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', err.message);
                message = 'Error' + err.message
            }
            console.log(err)
            if (err.status === '429') message = `${err.response.status}: too many requests`
            // this.setState({ message })
            this.props.liftMessage({ message })
        });
    }
    
    render() {
        console.log('rendering signupFlow');
        const initialProps = {
            first: this.state.first,
            last: this.state.last,
            email: this.state.email,
            password: this.state.password,
            handleChange: this.handleChange,
            
        }

        const profileProps = {
            profilePicture: this.state.profilePicture,
            skier: this.state.skier,
            snowboarder: this.state.snowboarder,
            complicated: this.state.complicated,
            homeMountain: this.state.homeMountain,
            handleChange: this.handleChange,
            submitSignup: this.submitSignup,
            handleFileChange: this.handleFileChange,
            handleCheckbox: this.handleCheckbox,
        }
        
        return (
            <div className="signup">
                <Typeography variant="h3">Sign Up</Typeography>
                <Grid container direction="column" alignItems="center" spacing={24}>
                    <Route exact path="/signup" render={() => <SignUpInitialForm {...initialProps} /> } />
                    <Route path="/signup/profile" render={() => <SignUpProfileForm {...profileProps}  /> } />
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(SignupFlow)