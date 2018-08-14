import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPencilAlt  } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import {if_auth} from './auth'

export default class SinglePost extends Component {
  render(){
    return(
      <div key={this.props.el.slug} className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Link tabIndex="-1" to={'/post/'+this.props.el.slug} >
              {this.props.el.title}
            </Link>
          </h2>
          {if_auth() &&
            <div className="edit-icons">
              <span
                alt="Delete this post"
                title="Delete this post"
                tabIndex="0"
                onClick={()=>this.props.post_delete(this.props.el.slug)}>
                  <FontAwesomeIcon icon={faTrash} />
              </span>
              <Link
                tabIndex="-1"
                to={'/edit/'+this.props.el.slug}
                >
                <span tabIndex="0" alt="Edit this post" title="Edit this post">
                  <FontAwesomeIcon icon={faPencilAlt} />
                </span>
              </Link>
            </div>
          }
          <p className="blog-post-meta">{this.props.el.created} by Alessandro<br/>Tags:&nbsp;
            {this.props.el.tags.map(
              (tag,index) =>
              <Link
                to={'/post_by_tag/'+tag.tag}
                key={tag.tag}
                className="tag_filter">{(index ? ', ': '') + tag.tag }
              </Link>
            )}
          </p>
        </div>
        <div className="card-content" dangerouslySetInnerHTML={{__html: this.props.el.html}}></div>
      </div>
    )
  }
}
