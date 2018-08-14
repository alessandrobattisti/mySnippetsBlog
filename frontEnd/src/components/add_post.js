import React from 'react';
import {scrollToTop, get_tags} from './../utils/utils'
import { withRouter } from 'react-router'
import { post_update_url, post_create_url } from './../config'
import { create_request, request } from './../utils/fetch_helpers'
import { PostForm } from './forms'

class AddPost extends React.Component {
  state = {initials:{title:'', text:'', tags:''}}

  componentWillMount(){
    scrollToTop(300);

    if(this.props.location.pathname.includes('/edit/')){
      this.mode = 'editing'
      this.title = "Edit this post"
    }else{
      this.mode = 'new'
      this.title = "Add new post"
    }
  }

  componentDidMount(){
    if(this.props.location.pathname.includes('/edit/')){
      const url = post_update_url + this.props.match.params.slug
      this.props.toggle_loader_modal(true)
      request(url)
        .then(data => {
          this.props.toggle_loader_modal(false)
          this.props.update_section_title(`Edit post: ` + data.title);
          this.setState(
            {
              initials: {
                title: data.title,
                txt: data.content,
                tags: data.tags.map(el => el.tag).join(', ')
              }
            }
          )
        })
        .catch(err => {
          this.props.toggle_loader_modal(false)
          if(err==='not found'){
            this.props.history.push('/404')
          }else{
            this.props.add_notification({ type:'error', message: err })
          }
        })
    }else{
      this.props.update_section_title(`Create post`);
    }
  }

  form_submit(e, values){
    e.preventDefault();
    // get data from form
    const data = {
        title : values.title,
        content : values.txt,
        tags : get_tags(values.tags, 'tag'),
        published : true
    }
    this.setState({
      initials: {
        txt:values.txt,
        title:values.title,
        tags:values.tags}
      }
    )
    let url = ''
    let method = ''
    if(this.mode==='editing'){
      url = post_update_url+ this.props.match.params.slug
      method = 'PUT'
    }else{
      url = post_create_url
      method = 'POST'
    }
    // create and send request
    const myRequest = create_request(method, url, data)
    this.props.toggle_loader_modal(true)
    request(myRequest)
      .then(data => {
        this.props.toggle_loader_modal(false)
        //console.log(data);
        this.props.update_sidebar();
        this.props.history.push('/post/'+data.slug);

        if(this.mode==='editing'){
          this.props.add_notification(
            { type:'success', message: 'Post edited successfully' }
          )
        }else{
          this.props.add_notification(
            { type:'success', message: 'Post created successfully' }
          )
        }

      })
      .catch(err => {
        this.props.toggle_loader_modal(false)
        this.props.add_notification({ type:'error', message: err })
      })
  }

  render() {
    return (
      <section id="edit-post-section" className="content">
        <div className="card" id="new-post-card">
          <h3 className="card-header">{this.title}</h3>
          <PostForm form_submit={this.form_submit.bind(this)} initials={this.state.initials}/>
        </div>
      </section>
    )
  }
}

export default withRouter(AddPost)
