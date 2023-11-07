import React from 'react';
import { NavLink } from 'react-router-dom';

const NavItem = ({ icon, label, link, isExternal }) => {
  const renderDom = () => {
    if (isExternal) {
      return (
        <a href={link} className="rnw aic vsio-nav-item">
          <span className="dpf jcc aic vsio-icon">{icon}</span>
          <span className="vsio-nav-item-label">{label}</span>
        </a>
      );
    } else {
      return (
        <NavLink
          to={link}
          className="rnw aic vsio-nav-item"
          activeclassname="vsio-nav-item--active"
        >
          <span className="dpf jcc aic vsio-icon">{icon}</span>
          <span className="vsio-nav-item-label">{label}</span>
        </NavLink>
      );
    }
  };
  return (
    <li className="rnw nav-list-item">
      {renderDom()}
      <style jsx>{`
        .nav-list-item {
          width: 100%;
        }

        .nav-list-item + .nav-list-item {
          margin-top: 4px;
        }
      `}</style>
      <style global="true" jsx>{`
        .vsio-nav-item {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid transparent;
          border-radius: 3px;
        }

        .vsio-nav-item:hover,
        .vsio-nav-item--active {
          border: 1px solid var(--light-gray);
        }

        .vsio-nav-item:focus {
          border: 1px solid var(--dark-gray);
          outline: none;
        }

        .vsio-nav-item-label {
          font-size: var(--fs-md);
          color: var(--black);
          margin-left: 8px;
        }
      `}</style>
    </li>
  );
};

export default NavItem;
