import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import {list_post_url} from './config'
import fetch from 'isomorphic-fetch';
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.sessionStorage = sessionStorageMock; // Needed to use sessionStorage

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, div);
  setTimeout(()=>ReactDOM.unmountComponentAtNode(div), 1000) //timout to wait until fetch request has completed
});

it('should be able to fetch', ()=> {
  fetch(list_post_url).then(r => r.json())
    .then(r =>
      expect(r.results.length).toBe(4)
    )
})
