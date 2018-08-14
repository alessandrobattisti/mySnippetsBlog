import React  from 'react';
import { Route, Redirect, withRouter} from 'react-router-dom'
import { create_request, request } from './../utils/fetch_helpers'
import { api_token_auth } from './../config'
import { LoginForm } from './forms'

function fakeAuth(){
  const token = sessionStorage.getItem('jwtToken');
  if(token){
    return true
  }else{
    return false
  }
}

function getToken(){
  const token = sessionStorage.getItem('jwtToken');
  return token
}

//https://tylermcginnis.com/react-router-protected-routes-authentication/
const PrivateRoute = ({ render: Render,  ...rest }) => (
  <Route {...rest} render={(props) => (
    fakeAuth() === true
      ? Render()
      : <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
  )} />
)

function logout(){
    sessionStorage.removeItem('jwtToken');
    this.setState({logged_in:false})
}

//https://tylermcginnis.com/react-router-protected-routes-authentication/
class Login2 extends React.Component {
  state = {
    redirectToReferrer: false
  }
  componentDidMount(){
    this.props.update_section_title(`Login`);
  }
  login(e, values){
    e.preventDefault()
    const data =  {
                    'username':values.user,
                    'password':values.psw
                  }

    const myRequest = create_request('POST', api_token_auth, data)
    this.props.toggle_loader_modal(true)
    request(myRequest)
      .then(data => {
        this.props.toggle_loader_modal(false)
        sessionStorage.setItem('jwtToken', 'Token '+ data['token']);
          this.props.add_notification(
            { type:'success',
              message:'You\'ve logged in successfully'
            }
          )
        this.setState(() => ({
          redirectToReferrer: true
        }))
      })
      .catch(err => {
        console.log(err)
        this.props.toggle_loader_modal(false)
        if(err==='invalid credentials'){
          sessionStorage.setItem('jwtToken', 'No-Token');
          console.log('info')
          this.props.add_notification(
            { type:'info',
              message:'You logged in as guest you will not be able to edit the database'
            }
          )
          this.setState(() => ({
            redirectToReferrer: true
          }))
        }else{
          this.props.add_notification(
            { type:'error',
              message:err
            }
          )
        }
      })
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state

    if (redirectToReferrer === true) {
      return <Redirect to={from} />
    }

    return (
      <section className="content">
        <div>
          <h3>Login</h3>
          <hr/>
          <p id="login-message">
            Since this website is mainly a test project to learn React the login process
            will always succeed and you will see the website with Administrator privileges,
            anyway you will not have the rights to modify the data in the database.
          </p>
          <hr/>
          <LoginForm login={this.login.bind(this)}/>
        </div>
      </section>
    )
  }
}

function if_auth(){
  const token = sessionStorage.getItem('jwtToken');
  if(token){
    return true
  }else{
    return false
  }
}
const Login = withRouter(Login2)
export {Login, logout, getToken, if_auth, fakeAuth, PrivateRoute}
