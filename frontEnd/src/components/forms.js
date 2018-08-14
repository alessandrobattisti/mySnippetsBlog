import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import {g_recaptcha} from './token'

class SearchForm extends Component {
  componentWillReceiveProps(NextProps){
    if(NextProps.show_sidebar){
      this.form.classList.add('show')
    }else{
      this.form.classList.remove('show')
    }
  }
  render(){
    return (
      <form
        onSubmit={(e)=>this.props.research(e, this.query_val.value)}
        method="get"
        className="form-inline"
        action="/search"
        id="search-form"
        ref={form => {this.form = form}}
        >
          <input
            className="form-control mr-sm-2"
            name="q" id="search_value"
            placeholder="Search"
            aria-label="Search"
            type="search"
            ref={query_val => {this.query_val = query_val}}
          >
          </input>
          <input type="submit" hidden></input>
          <span
            id="search-run"
            tabIndex="0"
            onClick={(e)=>this.props.research(e, this.query_val.value)}
            onKeyPress={(e)=>this.props.research(e, this.query_val.value)}
            >
            <FontAwesomeIcon icon={faSearch} />
          </span>
      </form>
    )
  }
}

class EditTagForm extends React.Component {
  render(){
    return (
      <form onSubmit={(e)=>this.props.form_submit(e, {tag:this.tag.value, categories:this.cat.value})} id="new_post_form">
        <div className="form-group">
          <label htmlFor="tag">Tag</label>
          <input
            type="text"
            id="tag"
            name="tag"
            ref={tag => {this.tag = tag}}
            defaultValue={this.props.initials.tag}>
          </input>
        </div>
        <div className="form-group">
          <label htmlFor="categories">Categories</label>
          <input
            type="text"
            id="categories"
            name="categories"
            ref={cat => {this.cat = cat}}
            defaultValue={this.props.initials.cat}>
          </input>
          <div className="form-helper">Comma separated list of categories</div>
        </div>
        <div className="form-group">
          <button type="submit" id="new_post_save">Save</button>
        </div>
      </form>
    )
  }
}

class PostForm extends React.Component {
  handleTxtChange = (event) => {
    this.setState({ txt: event.target.value });
  };
  state = {txt:''}
  componentWillReceiveProps(Pr){
    this.setState({txt:Pr.initials.txt})
  }
  render(){
    return(
      <form onSubmit={(e)=>this.props.form_submit(e, {title:this.title.value, txt:this.state.txt, tags:this.tags.value})} id="new_post_form">
        <div className="form-group">
          <label htmlFor="new_post_title">Title</label>
          <input
            type="text"
            id="new_post_title"
            name="new_post_title"
            defaultValue={this.props.initials.title}
            ref={title => {this.title = title}}
            required
            >
          </input>
        </div>
        <div className="form-group">
          <label htmlFor="new_post_text">Content</label>
          <textarea
            id="new_post_text"
            name="new_post_text"
            value = {this.state.txt}
            onChange={this.handleTxtChange}
            ref={txt => {this.txt = txt}}
            required
            >
          </textarea>
        </div>
        <div className="form-group">
          <label htmlFor="new_post_tags">Tags</label>
          <input
            type="text"
            id="new_post_tags"
            name="new_post_tags"
            defaultValue = {this.props.initials.tags}
            ref={tags => {this.tags = tags}}
            required
            >
          </input>
          <div className="form-helper">Comma separated list of tags</div>
        </div>
        <div className="form-group">
          <button type="submit" id="new_post_save">Save</button>
        </div>
      </form>
    )
  }
}

class LoginForm extends React.Component {
  render(){
    return (
      <form onSubmit={(e)=>this.props.login(e, {user:this.user.value, psw:this.psw.value})} id="new_post_form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required ref={user=>{this.user=user}}></input>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required ref={psw=>{this.psw=psw}}></input>
        </div>
        <div className="form-group">
          <button type="submit" id="new_post_save">Save</button>
        </div>
      </form>
    )
  }
}


class CommentForm extends React.Component {

  f_submit(e){
    this.rec.innerHTML = ""
    if (window.grecaptcha.getResponse() === ""){
        this.rec.innerHTML = "Please verify that you're a human"
    }else{
      this.props.form_submit(e, {author:this.auth.value, txt:this.txt.value})
      this.c_form.reset()
    }
  }

  render(){
    return (
      <form id="comment-form" onSubmit={(e)=>this.f_submit(e)} ref={c_form => {this.c_form=c_form}}>
        <h4 id="new-comment-title" className="comment-section-titles">Add a new comment:</h4>
        <div className="form-group">
          <label htmlFor="comment-author">Name</label>
          <input id="comment-author" type="text" required ref={auth => {this.auth=auth}}></input>
        </div>
        <div className="form-group">
          <label htmlFor="comment-author">Message</label>
          <textarea id="comment-content" required ref={txt => {this.txt=txt}}></textarea>
        </div>
        <div id="g-recaptcha" className="g-recaptcha"  data-sitekey={g_recaptcha}></div>
        <div id="recaptcha-error" ref={rec => {this.rec = rec}}></div>
        <div className="form-group">
          <button type="submit" id="new_post_save">Save</button>
        </div>
      </form>
    )
  }
}

export {SearchForm, EditTagForm, PostForm, LoginForm, CommentForm}
