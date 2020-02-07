import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'

//MUI stuff
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

//redux stuff
import {connect} from 'react-redux';
import {submitComment} from '../../redux/actions/dataActions'

const styles = theme => ({
    ...theme
})

export class CommentForm extends Component {
    state= {
        body: '',
        errors: {}

    }

    componentWillReceiveProps(nextProps) {
        //에러발생 후 다시 코멘트창 켯을때 남아있는 에러 없애기
        if(nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            })
        }
        //코멘트가 작성되고 서브밋 버튼 클릭시 body초기화
        if(!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({
                body: ''
            })
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]  : event.target.value
        })
    }
    //screamId값, form 에서 받은 body값을 dataActions.js의 submitComment로 보냄.
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.submitComment(this.props.screamId, { body: this.state.body });
    }

    render() {
        const { classes, authenticated} = this.props;
        const errors = this.state.errors;
        
        //토큰 이 살아있다면, 코멘트 폼을 보여주라. 아니면 null 처리.
        const commentFormMarkup = authenticated ? (
            <Grid item sm={12} style={{ textAlign: 'center' }}>
                <form onSubmit={this.handleSubmit}>
                    <TextField 
                        name="body"
                        type="text"
                        label="comment on scream"
                        error={errors.comment ? true : false}
                        helperText={errors.comment}
                        value={this.state.body}
                        onChange={this.handleChange}
                        fullWidth
                        className={classes.TextField}
                    />
                    <Button type="submit" variant="contained" color="primary" className={classes.button} >
                        Submit
                    </Button>
                </form>
                <hr className={classes.visibleSeparator} />
            </Grid>
        ): null
        return commentFormMarkup
    }
}

CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired

}

const mapStateToProps = state => ({
    UI: state.UI,
    authenticated: state.user.authenticated
})

export default connect(mapStateToProps, {submitComment}) (withStyles(styles)(CommentForm))
