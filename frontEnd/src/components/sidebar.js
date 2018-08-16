import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import {if_auth} from './auth'
import { request } from './../utils/fetch_helpers'
import { list_categories_url } from './../config'
import Hammer from 'hammerjs';

export default class App extends Component {
  state = {'results':[], 'orig_res':[] }

  update_sidebar(){
    const url = list_categories_url
    request(url, false)
      .then(function(data){
        const new_list = Object.keys(data).map(
          el => [ el, data[el] ]
        )
        if(this.is_mounted===true){//this should be avoided but I'll leave it for now
          this.setState( {'results':new_list, 'orig_res':new_list} )
        }
      }.bind(this))
      .catch(
        err => {if(this.is_mounted===true){this.props.add_notification({ type:'error', message: err })}}
      )
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.update_sidebar===true){
      this.update_sidebar()
    }
    if(nextProps.show_sidebar){
      this.sidebar.classList.add('show')
    }else{
      this.sidebar.classList.remove('show')
    }
  }

  componentDidMount(){
    this.hammer = Hammer(this.sidebar)
    this.hammer.on('swipeleft', function(e){
      this.props.toggle_sidebar()
    }.bind(this));    // remove ()

    this.is_mounted = true //this should be avoided but I'll leave it for now
    this.update_sidebar()
    //sidebar always visible
    window.addEventListener('scroll', function(e){
      const el = this.sidebar
      if(window.innerWidth<851){
        el.style.top = '100px'
        return
      }
      const el_bottom = el.offsetTop + el.offsetHeight
      if(el_bottom < window.pageYOffset){
        el.style.top = window.pageYOffset +'px'
      }
      if(el.offsetTop > window.pageYOffset && window.pageYOffset >= 115){
        el.style.top = window.pageYOffset +'px'
      }
      if(window.pageYOffset <= 115){
        el.style.top = '115px'
      }
    }.bind(this))
  }

  componentWillUnmount(){
    this.is_mounted = false //this should be avoided but I'll leave it for now
  }

  /* Filter sidebar categories */
  cat_filter(e){
    const d = e.target.value;
    this.setState(function(prevState){
      let re = new RegExp(d, 'i');
      prevState.results = prevState.orig_res.filter(function(el){
        if(re.test(el[0])){
          return el
        }else{
          let ret = false;
          el[1].forEach(function(el){
            if(re.test(el.tag)){
              ret = true
            }
          })
          if(ret){
            return el
          }
          return null
        }
      })
      return prevState
    })
  }

  rem_cat_filter(){
    this.input_cat.value = ''
    this.setState(function(prevState){
      prevState.results = prevState.orig_res.slice();
      return prevState
    })
  }

  render(){
    return (
      <section id="sidebar" ref={sidebar => {this.sidebar = sidebar}}>
        <h3 className="sidebar-title">Categories</h3>
        <div id="filter-cat">
          <input
            id="input-cat"
            placeholder="Filter categories"
            type="text"
            onChange={(e)=>this.cat_filter(e)}
            ref = {input_cat => {this.input_cat = input_cat}}
            >
          </input>
          <span
            tabIndex="0"
            onKeyPress={()=>{this.rem_cat_filter()}}
            onClick={()=>{this.rem_cat_filter()}}

            id="remove-cat-filter"
            title="Remove category filter"
            alt="Remove category filter">
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </div>
        {this.state.results.map(function(el){
          return (
            <div key={el[0]}>
               <h4 className="sidebar-cat-title">{el[0]}</h4>

               {el[1].map(
                 tag =>
                  <div key={tag.tag}>
                    {if_auth() &&
                      <Link
                        tabIndex="0"
                        to={'/edit_tag/'+tag.tag}
                        onKeyPress={()=>this.props.toggle_sidebar()}
                        onClick={()=>this.props.toggle_sidebar()}
                        >
                        <span tabIndex="0" alt="Edit this tag" title="Edit this tag">
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                      </Link>
                    }
                   <span>
                      <Link
                        tabIndex="0"
                        onKeyPress={()=>{this.props.tag_filter(tag.tag)}}
                        onClick={()=>{this.props.tag_filter(tag.tag)}}
                        className="tag_filter_sidebar"
                        to={'/post_by_tag/'+tag.tag}
                        >
                        {tag.tag}
                     </Link>

                     ({tag.post_count})
                     <br/>
                   </span>
                 </div>
               )}
            </div>
          )
        }.bind(this))}
      </section>
    )
  }
}
