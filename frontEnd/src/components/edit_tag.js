import React from 'react';
import {scrollToTop, get_tags} from './../utils/utils'
import { withRouter } from 'react-router'
import { create_request, request } from './../utils/fetch_helpers'
import { tag_list_url } from './../config'
import { EditTagForm } from './forms'


class EditTag extends React.Component {
  state = {tag:'', initials:{cat:'',tag:''}}

  componentWillMount(){
    scrollToTop(300)
      console.log(this.props, this.state.tag)
    this.url = tag_list_url + this.props.match.params.tag
  }

  componentDidMount(){
    this.request_tag()
  }

  componentDidUpdate(){
    if(this.state.tag!==this.props.match.params.tag){
      this.url = tag_list_url + this.props.match.params.tag
      this.setState({tag:this.props.match.params.tag})
      this.request_tag()
    }
  }

  request_tag(){
    this.props.toggle_loader_modal(true)
    request(this.url)
      .then(data => {
        this.props.toggle_loader_modal(false)
        this.props.update_section_title('Editing tag: ' + data.tag);
        this.setState(
          {initials:
              { cat: data.categories.map(e => e.category).join(', '),
                tag: data.tag }
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
  }

  form_submit(e, values){
    e.preventDefault()
    // get data from form
    const data = {
        tag : values.tag,
        categories : get_tags(values.categories, 'category'),
    }
    // create request
    const myRequest = create_request('PUT', this.url, data)
    // send request
    this.props.toggle_loader_modal(true)
    request(myRequest)
      .then(data => {
        this.props.toggle_loader_modal(false)
        this.props.update_sidebar();
        this.props.add_notification(
          { type:'success', message: 'Tag edited successfully' }
        )
        /*this.props.history.push('/');*/
      })
      .catch(
        err => {
          this.props.toggle_loader_modal(false)
          this.props.add_notification({ type:'error', message: err })
        }
      )
  }

  render() {
    return (
      <section id="edit-tag-section" className="content">
        <div className="card" id="new-post-card">
          <h3 className="card-header">Edit tag</h3>
          <EditTagForm form_submit={this.form_submit.bind(this)} initials={this.state.initials}/>
        </div>
      </section>
    )
  }

}

export default withRouter(EditTag)
