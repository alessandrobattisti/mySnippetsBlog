import React from 'react';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

class NothingFound extends React.Component{
  componentWillMount(){
    this.props.update_section_title('Nothing found');
  }
  render(){
    return (
      <section id="json-sec" className="content">
        <h3 className="section-title">Nothing found</h3>
        <p>Sorry, we could not find any post matching your search.</p>
        <div className="back-to-main-page">
          <Link to='/' className="a_color" title="Back to main page">
            <FontAwesomeIcon icon={faArrowLeft} />   Back to main page
          </Link>
        </div>
      </section>
    )
  }
}

export {NothingFound}
