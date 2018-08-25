import React, { Component } from 'react';
import './css/App.css';
import Sidebar from './components/sidebar'
import Posts from './components/posts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faArrowLeft, faBars } from '@fortawesome/free-solid-svg-icons'
import { Route, Switch } from 'react-router-dom'
import { Component404 } from './components/404'
import AddPost from './components/add_post'
import EditTag from './components/edit_tag'
import { Link } from 'react-router-dom'
import loader_img from './img/loader.gif'
import {Login, logout, if_auth, PrivateRoute} from './components/auth'
import { withRouter } from 'react-router'
import SinglePostPage from './components/single_post_page'
import About from './components/about'
import {NothingFound} from './components/nothing_found'
import { scrollToTop } from './utils/utils'
import { Notification } from './components/error_handling'
import { SearchForm } from './components/forms'
import Hammer from 'hammerjs';

class SectionTitle extends Component {
  componentDidMount(){
    document.title = this.props.section_title;
  }
  componentWillReceiveProps(NextProps){
    document.title = NextProps.section_title;
  }
  render(){
    return (
      <h2 id="post-title">{this.props.section_title}</h2>
    )
  }
}

class ScreenProtector extends Component {
  componentWillReceiveProps(nextProps){
    if(nextProps.show_sidebar){
      this.screen_protector.classList.add('show')
    }else{
      this.screen_protector.classList.remove('show')
    }
  }

  render(){
    return(
      <div
        id="screen-protector"
        onClick={()=>{this.props.toggle_sidebar()}}
        ref={screen_protector=>{this.screen_protector=screen_protector}}
        ></div>
    )
  }
}
class LoaderModal extends Component {

  state = {show_loader:false}

  componentWillReceiveProps(NextProps){
    if(NextProps.show_loader!==this.state.show_loader){
      this.setState({show_loader:NextProps.show_loader})
      if(NextProps.show_loader){
        this.loader.style.display = 'block'
      }else{
        this.loader.style.display = 'none'
      }
    }
  }

  render(){
    return (
      <div
          className="modal"
          id="modal"
          ref={loader => { this.loader = loader }}
      >
        <img alt="loader" id="modal-loader" src={loader_img}/>
      </div>
    )
  }
}


class App extends Component {

  state = {
    'tag_filter': '',
    'search_filter': '',
    'update_sidebar': false,
    'update_posts': true,
    'notification': {'type':'', 'message':false, 'id':0},
    'show_loader': false,
    'section_title': 'Latest posts',
    'show_sidebar': false,
   }

  update_section_title(title){
    this.setState({section_title:title, 'update_posts':false})
  }

  toggle_loader_modal(show){
    this.setState({'show_loader':show, 'update_posts':false})
  }

  toggle_sidebar(){
    if(this.state.show_sidebar){
      this.setState({show_sidebar:false, update_posts:false})
    }else{
      this.setState({show_sidebar:true, update_posts:false})
    }
  }
  show_sidebar(){
    this.setState({show_sidebar:true, update_posts:false})
  }
  hide_sidebar(){
    this.setState({show_sidebar:false, update_posts:false})
  }

  add_notifications(notification){
    let id = this.state.notification.id
    notification.id = id+1
    this.setState({notification:notification, 'update_posts':false})
  }


  tag_filter(tag){
    this.setState({tag_filter:tag, update_posts:true}, () => {scrollToTop(300), this.toggle_sidebar()})
  }

  componentWillReceiveProps(newprops){
    if(newprops.location.pathname==='/'){
      this.setState({'section_title': 'Latest posts'})
    }
  }

  componentDidMount(){
    scrollToTop(0)
    this.hammer = Hammer(this.container, {
        behavior: {
          userSelect: true
      }
    })
    this.hammer.on('swiperight', function(e){
      this.show_sidebar()
    }.bind(this));    // remove ()
    this.hammer.on('swipeleft', function(e){
      this.hide_sidebar()
    }.bind(this));    // remove ()

  }

  research(e, query_val){
    e.preventDefault()
    if(this.state.search_filter!==query_val){
      this.props.history.push('/search_results')
      //this.setState({'update_posts':true,'search_filter':query_val})
      this.setState({'search_filter':query_val, 'update_posts':true}, ()=>this.toggle_sidebar())

    }

  }

  clear_search(update_posts){
    this.setState({'search_filter':'', 'update_posts':update_posts})
  }

  update_sidebar(){
    this.setState({update_sidebar:true, update_posts:true}, ()=>{
      this.setState({update_sidebar:false, update_posts:false})
    })
  }

  render() {
    return (
      <div className="App">
        <header className="header">
          <div className="header-container">
            <FontAwesomeIcon
              id="burger"
              tabIndex="0"
              icon={faBars}
              onKeyPress={this.toggle_sidebar.bind(this)}
              onClick={this.toggle_sidebar.bind(this)}
            />
          <h1 className="header-title">mySnippets <span id="title-blog">Blog</span></h1>
            <div className="header-link"><Link to='/about'>About</Link></div>
            <div className="header-link">
              {!if_auth() && <Link to='/login'>Login</Link>}
              {if_auth() &&  <Link to='/' onClick={logout.bind(this)} >Logout</Link>}
            </div>
            <SearchForm show_sidebar={this.state.show_sidebar} research={this.research.bind(this)}/>
          </div>
        </header>
        <Notification notification={this.state.notification}/>

        <div className="container" ref={container => {this.container=container}}>
          <LoaderModal show_loader = {this.state.show_loader} />
          <ScreenProtector
            toggle_sidebar={this.toggle_sidebar.bind(this)}
            show_sidebar={this.state.show_sidebar}
          />
          <div className="title-bar">
            <SectionTitle section_title={this.state.section_title} />
            {window.location.pathname==='/' && if_auth() &&
            <Link
              to="/add_new"
              id="add-post"
              alt="Add post"
              title="Add post"
              tabIndex="0"
              onClick={()=>{this.clear_search(false)}}
              onKeyPress={()=>{this.clear_search(false)}}
              >
              <FontAwesomeIcon icon={faPlus} />
            </Link>
            }
            {window.location.pathname!=='/' &&
            <Link
              to="/"
              id="add-post"
              alt="Back to main page"
              title="Back to main page"
              tabIndex="0"
              onClick={()=>{ this.clear_search(true)}}
              onKeyPress={()=>{ this.clear_search(true)}}
              >
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
            }

          </div>
          <Sidebar
            tag_filter={this.tag_filter.bind(this)}
            clear_search={this.clear_search.bind(this)}
            update_sidebar={this.state.update_sidebar}
            add_notification={this.add_notifications.bind(this)}
            show_sidebar={this.state.show_sidebar}
            toggle_sidebar={this.toggle_sidebar.bind(this)}
          />
          <Route exact path='/' render = {() => (
            <Posts
              tag_filter={this.state.tag_filter}
              tag_filter_f={this.tag_filter.bind(this)}
              search_filter={this.state.search_filter}
              update_sidebar={this.update_sidebar.bind(this)}
              update_posts={this.state.update_posts}
              clear_search={this.clear_search.bind(this)}
              add_notification={this.add_notifications.bind(this)}
              toggle_loader_modal={this.toggle_loader_modal.bind(this)}
              update_section_title={this.update_section_title.bind(this)}
              />
          )} />
          <PrivateRoute exact path='/edit/:slug' render={(props)=>(
              <AddPost
                add_notification={this.add_notifications.bind(this)}
                update_sidebar={this.update_sidebar.bind(this)}
                toggle_loader_modal={this.toggle_loader_modal.bind(this)}
                update_section_title={this.update_section_title.bind(this)}
              />
          )} />
          <PrivateRoute exact path='/add_new' render={(props)=>(
              <AddPost
                add_notification={this.add_notifications.bind(this)}
                update_sidebar={this.update_sidebar.bind(this)}
                toggle_loader_modal={this.toggle_loader_modal.bind(this)}
                update_section_title={this.update_section_title.bind(this)}
              />
          )} />
          <PrivateRoute exact path='/edit_tag/:tag' render={(props)=>(
              <EditTag
                add_notification={this.add_notifications.bind(this)}
                update_sidebar={this.update_sidebar.bind(this)}
                toggle_loader_modal={this.toggle_loader_modal.bind(this)}
                update_section_title={this.update_section_title.bind(this)}
              />
          )}/>
          <Route exact path='/post/:slug' render={(props)=>(
              <SinglePostPage
                add_notification={this.add_notifications.bind(this)}
                update_sidebar={this.update_sidebar.bind(this)}
                toggle_loader_modal={this.toggle_loader_modal.bind(this)}
                update_section_title={this.update_section_title.bind(this)}
                />
          )} />
          <Route exact path='/post_by_tag/:tag' render={(props)=>(
              <Posts
                tag_filter={this.state.tag_filter}
                tag_filter_f={this.tag_filter.bind(this)}
                search_filter={this.state.search_filter}
                update_sidebar={this.update_sidebar.bind(this)}
                update_posts={this.state.update_posts}
                clear_search={this.clear_search.bind(this)}
                add_notification={this.add_notifications.bind(this)}
                toggle_loader_modal={this.toggle_loader_modal.bind(this)}
                update_section_title={this.update_section_title.bind(this)}
              />
          )} />

          <Route exact path='/search_results' render={(props)=>(
              <Posts
                tag_filter={this.state.tag_filter}
                tag_filter_f={this.tag_filter.bind(this)}
                search_filter={this.state.search_filter}
                update_sidebar={this.update_sidebar.bind(this)}
                update_posts={this.state.update_posts}
                clear_search={this.clear_search.bind(this)}
                add_notification={this.add_notifications.bind(this)}
                toggle_loader_modal={this.toggle_loader_modal.bind(this)}
                update_section_title={this.update_section_title.bind(this)}
              />
          )} />

          <Route path="/about" render={()=>(
              <About update_section_title={this.update_section_title.bind(this)} />
          )} />

          <Route path="/login" render={()=>(
              <Login
                add_notification={this.add_notifications.bind(this)}
                toggle_loader_modal={this.toggle_loader_modal.bind(this)}
                update_section_title={this.update_section_title.bind(this)}
                />
            )}
          />

          {/* This switch handle 404 pages */}
          <Switch>
            <Route exact path='/' />
            <Route exact path='/edit/:slug'/>
            <Route exact path='/post/:slug'/>
            <Route exact path='/edit_tag/:tag'/>
            <Route exact path='/post_by_tag/:tag'/>
            <Route exact path='/add_new' />
            <Route exact path='/info' />
            <Route exact path='/login' />
            <Route exact path='/about' />
            <Route exact path='/search_results' />
            <Route exact path='/nothing_found'render={()=>(
                <NothingFound
                  update_section_title={this.update_section_title.bind(this)}
                />
            )} />
            <Route render={()=>(
                <Component404
                  update_section_title={this.update_section_title.bind(this)}
                />
            )} />
          </Switch>

      </div>
      </div>
    );
  }
}

export default withRouter(App);
