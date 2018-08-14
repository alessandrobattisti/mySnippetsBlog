import React from 'react';

class Notification extends React.Component {
  state = {message_id:0}

  componentWillReceiveProps(NextProps){
    //console.log(NextProps, this.state.message_id)
    const not = NextProps.notification
    if(not.message !== '' && not.id !== this.state.message_id){
      this.setState({message_id:not.id})
      this.notification.innerHTML = `<p>${not.message}</p>`
      this.notification.classList.remove('hidden')
      if(not.type==='error'){
        this.notification.classList.remove('success-handling')
        this.notification.classList.add('error-handling')
        this.notification.classList.remove('info-handling')
      }else if(not.type==='success'){
        this.notification.classList.add('success-handling')
        this.notification.classList.remove('info-handling')
        this.notification.classList.remove('error-handling')
      }else if(not.type==='info'){
        this.notification.classList.add('info-handling')
        this.notification.classList.remove('success-handling')
        this.notification.classList.remove('error-handling')
    }
      setTimeout(function(){ this.notification.classList.add('hidden') }.bind(this), 3000);
    }
  }
  render() {
    return (<div className="success-handling hidden" ref={notification => {
        this.notification = notification;
      }}>
      <p>There was an error</p>
    </div>)
  }
}

export {
  Notification
}
