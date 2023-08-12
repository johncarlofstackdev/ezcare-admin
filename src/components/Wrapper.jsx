import React from 'react'

const Wrapper = (props) => <div className={`wrapper ${props.className ? props.className : ''}`}> {props.children} </div>
Wrapper.Header = (props) => <nav className={`main-header ${props.className ? props.className : ''}`}> {props.children} </nav>
Wrapper.Aside = (props) => <aside className={`main-sidebar ${props.className ? props.className :''}`}> {props.children} </aside>
Wrapper.ContentWrapper = (props) => <div className={`content-wrapper ${props.className ? props.className :''}`}> {props.children} </div>
Wrapper.Footer = (props) => <footer className={`main-footer ${props.className ? props.className : ''}`}> {props.children} </footer>
export default Wrapper;