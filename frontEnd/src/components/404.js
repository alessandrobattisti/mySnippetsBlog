import React from 'react';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

class Component404 extends React.Component{
  componentWillMount(){
    this.props.update_section_title('Page Not Found');
  }
  render(){
    return(
      <section id="json-sec" className="content">
        <h3 className="section-title">Page Not Found</h3>
        <p>Sorry, but the page you were trying to view does not exist.</p>
        <div className="back-to-main-page">
          <Link to='/' className="a_color" title="Back to main page">
            <FontAwesomeIcon icon={faArrowLeft} />   Back to main page
          </Link>
        </div>
      </section>
    )
  }
}

export {Component404}
