import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Scream from '../components/scream/Scream'
import Grid from '@material-ui/core/Grid'
import StaticProfile from '../components/profile/StaticProfile'


import { connect } from 'react-redux'
import { getUserData } from '../redux/actions/dataActions'

export class user extends Component {
    state = {
        profile : null
    }
    componentDidMount() {
        //handle은 내가 클릭한 유저의 파라미터 값 즉, URL의 파라미터 값을 가져온다.
        const handle = this.props.match.params.handle;//이 핸들 값이 getUserData()조회가 안됨.
        

        alert(`handle값이에용 :  ${handle}`)
        // this.props.getUserData(handle);
        // axios.get(`/user/${handle}`)
        //     .then(res => {
        //         this.setState({
        //             profile: res.data.user
        //         })
        //     })
        //     .catch(err => console.log(err))
    }
    render() {
        const { screams, loading  } = this.props.data;

        const screamsMarkup = loading ? (
            <p>loading Data...</p>
        ): screams === null ? (
            <p>No scream from this user</p>
        ) : (
            screams.map( scream => <Scream key={scream.screamId} scream={scream} /> )
        )

        return (
            <Grid container spacing={16}>
            <Grid item sm={8} xs={12}>
                {screamsMarkup}
            </Grid>
            <Grid item sm={4} xs={12}>
                {this.state.profile === null ? (
                    <p>Loading profile...</p>
                ): (<StaticProfile profile={this.state.profile} />)
                }
            </Grid>
            </Grid>
        )
    }
}

user.propTypes = {
    getUserData: PropTypes.func.isRequired,
    data : PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data
})

export default connect(
    mapStateToProps,
    { getUserData }
  )(user);