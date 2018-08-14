import React from 'react';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

class About extends React.Component {
  componentDidMount(){
    this.props.update_section_title('About')
  }
  render(){
    return (
      <section id="about-section" className="content">
        <h3 className="section-title">About this app</h3>
        <p>
          This blog will keep every code snippet I'll find useful. I'm doig my best
          to cite the source of these snippets but if I've missed one and you think
          to know the original source of a snippet let me know in the comments and
          I will update the post giving credits to the original source.
        </p>
        <p>
          This app is composed of two parts:
        </p>
        <ul>
          <li>A list of snippets</li>
          <li>A sidebar that lists the tags added to posts</li>
        </ul>
        <p>From the sidebar you can <b>filter</b> the blog posts.</p>
        <h4>Features</h4>
        <ul>
          <li>Infinite scrolling</li>
          <li>Full text search</li>
          <li>CRUD operation on Posts and Tag</li>
          <li>Comments section protected by Google Recaptcha</li>
        </ul>
        <h4>Technologies</h4>
        <p>Made with <b>ReactJs</b> and <b>Django Rest Framework</b></p>

          <h5>Front-end</h5>
          <p>
          Frontend has been built using the ReactJs library.
          </p>
          <p>This project was bootstrapped
            with <a rel="noopener noreferrer"
                    className="a_color"
                    href="https://github.com/facebookincubator/create-react-app"
                    target="_blank">Create React App</a>.
          </p>

          <h5>Back-end</h5>
          <p>
          Backend api has been built using Django and Rest Framework app.
          </p>

          <h5>Code</h5>
          <p>
            Github repo can be found at this
            <a
              className="a_color"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/alessandrobattisti/mySnippetsBlog"
              >
              Link
            </a>
          </p>

        <h4>Login</h4>
        <p>
          Since this website is mainly a test project to learn React the login process
          will always succeed and you will see the website with Administrator privileges,
          anyway you won't be able to modify the database.
        </p>
        <div className="back-to-main-page">
          <Link to='/' className="a_color" title="Back to main page">
            <FontAwesomeIcon icon={faArrowLeft} />   Back to main page
          </Link>
        </div>
      </section>
    )
  }
}


export default About
