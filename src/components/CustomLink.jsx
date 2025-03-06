import React from 'react'
import '../styles/CustomLink.css'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
const CustomLink = ({to, children, ...rest}) => {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({path: resolvedPath.pathname, end: true});

  return (
    <Link to={to} {...rest} children={children}
    className={`custom-link ${isActive ? 'active' : ''}`}>
    </Link>
  )
}

export default CustomLink