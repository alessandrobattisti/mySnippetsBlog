import React, { Component } from 'react';
import { isInViewport } from './../utils/utils'
import loader from './../img/loader.gif'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import SinglePost from './single_post'
import { create_request, request } from './../utils/fetch_helpers'
import { delete_post_url, list_post_url, list_post_url_by_tag, search_post_url } from './../config'
import { withRouter } from 'react-router'

/* delete duplicates from results array, just to be sure, no duplicates keys... */
function rm_dup(array){
  var items = [];
  return array.filter(function(el){
    if(items.indexOf(el.slug) === -1){
      items.push(el.slug);
      return true
    }
    return false
  })
}

class BottomLoader extends Component {
  componentWillReceiveProps(NewProps){
    if(NewProps.show){
      this.loader.style.display = 'block'
    }else{
      this.loader.style.display = 'none'
    }
  }
  render(){
    return(
      <img alt="loader" id="loader" src={loader} ref={loader=>{this.loader = loader}}/>
    )
  }
}

class NoPosts extends Component {
  componentWillReceiveProps(NextProps){
    if(NextProps.show){
      this.last_post.style.display = 'block'
    }else{
      this.last_post.style.display = 'none'
    }
  }
  render(){
    return (
      <div className="card-no-post" id="last-post" ref={last_post => {
          this.last_post = last_post;
        }}>
        There are no more posts to show right now.
      </div>
    )
  }
}

class Posts extends Component {
  constructor(props){
      super(props);
      this.on_scroll = this.on_scroll.bind(this);
  }

  state = {
    'search_filter': '',
    'results': [],
    'searching': false,
    'last_post_show': false,
    'bottom_loader_show': true
  }

  stop_loading = false
  url = list_post_url

  choose_what_do_download(nextProps){
    //search only if not the same search and not an empty search
    if(this.state.search_filter!==nextProps.search_filter && nextProps.search_filter!==''){
      this.props.update_section_title(`Search results for: ${nextProps.search_filter}`)
      this.url = search_post_url + nextProps.search_filter
      this.setState({
        results: [],
        search_filter: nextProps.search_filter,
        searching: true
      }, ()=> {this.download_new_posts()})
    }
    //if no tag props we are in home page so download the first 4 posts
    else if(!nextProps.match.params.tag){
      this.url = list_post_url
      this.setState(
        {
          'results': [],
          'tag_filter': ''
        }, () => this.download_new_posts()
      )
    }else if(this.state.tag_filter===nextProps.match.params.tag){
      return //do not download the same page again
    }
    //if the url != from home and not the same then download new posts
    else{
      this.url = list_post_url_by_tag + nextProps.match.params.tag
      this.props.update_section_title('Tag: '+nextProps.match.params.tag) //change title
      this.setState(
        {
          'results': [],
          'tag_filter': nextProps.match.params.tag
        }, () => this.download_new_posts()
      )
    }
  }

  componentDidMount(){
    this.setState({'results':[]}, () => this.choose_what_do_download(this.props))
    document.addEventListener('scroll', this.on_scroll, false)
  }

  componentWillUnmount() {
    //this.setState({'results':[], 'search_filter':''})
    document.removeEventListener('scroll', this.on_scroll, false);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.update_posts){
      //console.log(nextProps)
      this.choose_what_do_download(nextProps)
    }
  }

  on_scroll(){
    if(isInViewport(this.hook) & !this.stop_loading){
      this.stop_loading = true
      this.download_new_posts()
    }
  }

  download_new_posts(){
    if(this.url){
      this.setState({'last_post_show':false, 'bottom_loader_show':true})
      request(this.url, 'bottom_loader')
        .then(function(data){
          this.setState({'bottom_loader_show':false})
          if(data.count===0 && this.props.location.pathname==='/'){
            this.props.add_notification( { type:'info', message: 'No posts found, create your first snippet!' } )
            this.props.history.push('/add_new')
            return
          }
          else if(data.count===0 && !this.state.searching){
            this.props.clear_search(false);
            this.props.history.push('/404')
            return
          }
          else if(data.count===0 && this.state.searching){
            this.props.clear_search(false);
            this.props.history.push('/nothing_found')
            return
          }
          this.url = data['next']
          if(!this.url){
            this.setState({'last_post_show':true}) //show no more post
          }
          this.stop_loading = false
          this.setState({'results': rm_dup(this.state.results.concat(data.results)) })
        }.bind(this))
        .catch(
          err => {
            this.setState({'bottom_loader_show':false})
            this.props.add_notification( { type:'error', message: err } )
          }
        )
    }
  }

  post_delete(slug){
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure delete this post?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.actual_delete(slug)
        },
        {
          label: 'No',
          onClick: () => false
        }
      ]
    })
  }

  actual_delete(slug){
    const url = delete_post_url + slug
    const myRequest = create_request('DELETE', url, {})
    this.props.toggle_loader_modal(true)
    request(myRequest)
      .then(function(){
        this.props.toggle_loader_modal(false)
        this.props.add_notification(
          { type:'success',
            message:'Post deleted successfully'
          }
        )
        this.setState(function(prevState){
          prevState.results = rm_dup(prevState.results.filter(el => el.slug!==slug))
          if(prevState.results.length === 0){
            this.props.history.push('/')
          }
          return prevState
        }, () => this.props.update_sidebar() )
      }.bind(this))
      .catch(
        err => {
          this.props.add_notification( { type:'error', message: err })
          this.props.toggle_loader_modal(false)
        }
      )
  }

  render(){
    return (
      <section id="content" className="content">
        {this.state.results.map(function(el){
          return (
            <SinglePost
              el={el}
              key={el.slug}
              post_delete = {this.post_delete.bind(this)}
            />
          )
        }.bind(this))}
        <div id="hook" ref={hook=>{this.hook=hook}}>1</div>
        <BottomLoader show={this.state.bottom_loader_show}/>
        <NoPosts show={this.state.last_post_show}/>
      </section>
    )
  }
}
export default withRouter(Posts)
