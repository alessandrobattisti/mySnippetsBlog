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
          This blog will keep every code snippet I'll find useful. I will do my best
          to cite the source of these snippets, but sometimes when in a hurry
          I will forget to add it. So if you think to know the source of a snippet
          let me know in the comments and I will update the post giving credits
          to the original source.
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
          Infinite scrolling
          Full text search
          Comments protecte by Google Recaptcha
        </ul>
        <h4>Technologies</h4>
        <p>Made with <b>love</b>, <b>ReactJs</b> and <b>Django Rest Framework</b></p>

          <h5>Front-end</h5>
          <p>
          Frontend has been built using the ReactJs library. Github repo can be
          found at this <a className="a_color" href="">Link</a>
          </p>
          <p>This project was bootstrapped
            with <a rel="noopener noreferrer"
                    className="a_color"
                    href="https://github.com/facebookincubator/create-react-app"
                    target="_blank">Create React App</a>.
          </p>

          <h5>Back-end</h5>
          <p>
          Backend api has been built using Django and Rest Framework app. Github
          repo can be found at this <a className="a_color" href="">Link</a>
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
