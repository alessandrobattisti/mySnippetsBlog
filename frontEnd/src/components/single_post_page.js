import React, { Component } from 'react';
import SinglePost from './single_post'
import { withRouter } from 'react-router'
import Moment from 'react-moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash  } from '@fortawesome/free-solid-svg-icons'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import {if_auth} from './auth'
import {scrollToTop} from './../utils/utils'
import { delete_post_url, delete_comment_url, create_comment_url, post_update_url, comment_list_url } from './../config'
import { create_request, request } from './../utils/fetch_helpers'
import { CommentForm } from './forms'

function loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = () => {
        document.write("Error: Google Maps cannot be loaded at this time. Check your internet connection and try again.");
    };
    ref.parentNode.insertBefore(script, ref);
}

class SinglePostPage extends Component {
  state = {
    el: {title:'','created':'',tags:[],html:''},
    comments: []
  }

  componentWillMount(){
    scrollToTop(300)
  }

  componentDidMount(){
    loadJS(`https://www.google.com/recaptcha/api.js`)
    this.props.toggle_loader_modal(true)
    request(post_update_url + this.props.match.params.slug )
      .then(data => {
        this.props.toggle_loader_modal(false)
        this.props.update_section_title(data.title);
        this.setState({el:data})
      })
      .catch(err => {
        this.props.toggle_loader_modal(false)
        if(err==='not found'){
          this.props.history.push('/404')
        }else{
          this.props.add_notification( { type:'error', message: err } )
        }
      })

    this.props.toggle_loader_modal(true)
    request(comment_list_url + this.props.match.params.slug)
      .then(data => {
        this.setState({comments:data})
        this.props.toggle_loader_modal(false)
      })
      .catch(err => {
        this.props.toggle_loader_modal(false)
        this.props.add_notification( { type:'error', message: err } )
      })
  }

  form_submit(e, values){
    e.preventDefault()

    const data = {
        "google_auth": window.grecaptcha.getResponse(),
        "author": values.author,
        "content": values.txt,
        "reply_to": null,
        "post": this.state.el.pk
    }
    const myRequest = create_request('POST', create_comment_url, data)

    this.props.toggle_loader_modal(true)
    request(myRequest)
      .then(data => {
        this.props.toggle_loader_modal(false)
        this.props.update_sidebar();
        this.props.add_notification(
          { type:'success', message: 'Comment created successfully' }
        )
        this.setState(function(prevState){
          prevState.comments.push(data)
          return prevState
        },() => {
          window.grecaptcha.reset()
        } )
      })
      .catch(
        err => {
          this.props.add_notification({ type:'error', message: err })
          this.props.toggle_loader_modal(false)
        }
      )
  }

  post_delete(slug){
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure? Delete this post?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.post_actual_delete(slug)
        },
        {
          label: 'No',
          onClick: () => false
        }
      ]
    })
  }

  post_actual_delete(slug){
    const url = delete_post_url + slug
    const myRequest = create_request('DELETE', url, {})
    this.props.toggle_loader_modal(true)
    request(myRequest)
      .then(function(){
        this.props.toggle_loader_modal(false)
        this.props.update_sidebar();
        this.props.history.push('/');
        this.props.add_notification(
          { type:'success', message:'Post deleted successfully' }
        )
      }.bind(this))
      .catch(
        err => {
          this.props.toggle_loader_modal(false)
          this.props.add_notification( { type:'error',  message: err })
        }
      )
  }

  delete_comment(id){
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure? Delete this comment?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.actual_delete(id)
        },
        {
          label: 'No',
          onClick: () => false
        }
      ]
    })
  }

  actual_delete(id){
    const url = delete_comment_url + id
    const myRequest = create_request('DELETE', url, {})
    this.props.toggle_loader_modal(true)
    request(myRequest)
      .then(function(){
        this.props.toggle_loader_modal(false)
        this.props.add_notification(
          { type:'success', message:'Comment deleted successfully' }
        )
        this.setState({'comments':this.state.comments.filter(el=>el.id!==id)})
      }.bind(this))
      .catch(err =>
        {
          this.props.toggle_loader_modal(false)
          this.props.add_notification( { type:'error', message: err } )
        }
      )
  }

  render(){
    return(
      <section id="single-post-section" className="content">
        <SinglePost el={this.state.el} post_delete={this.post_delete.bind(this)}/>
        <div className="comments">
          <h3 id="comments-title" className="comment-section-titles">Comments:</h3>

          {this.state.comments.length>0&&this.state.comments.map((comment, key) => (
            <div key={comment.id} className="comment">
              <span className="comment-number">{key+1}</span>
              {if_auth() &&
                <span className="delete-comment" onClick={()=>this.delete_comment(comment.id)}>
                  <FontAwesomeIcon id="delete-comment-icon" icon={faTrash} />
                </span>
              }
              <p className="comment-text">
                {comment.content}
                <span className="comment-title"><b>{comment.author}</b>,&nbsp;
                  <Moment format="DD MMM, 'YY [at] HH:mm">{comment.created}</Moment>
                </span>
              </p>
            </div>
          ))}

          {this.state.comments.length===0 && <div id="no-comments">No comments yet</div>}
        </div>
        <div className="comments">
          <CommentForm form_submit={this.form_submit.bind(this)}/>
        </div>
      </section>
    )
  }
}

export default withRouter(SinglePostPage)
