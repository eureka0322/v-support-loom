import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import NavItem from './NavItem';
import Logo from '../Logo';
import LogoMark from '../LogoMark';
import RecordingBanner from '../RecordingBanner';
import {
  VideoPlayer,
  Team,
  LightHouse,
  FilmCamera,
} from '../../../shared/icons/';

import { baseUrl } from '../../../env.config';

const SidebarNavigation = () => {
  const menuRef = useRef(null);
  const [isMenuOpen, setMenuState] = useState(false);
  const [url, setUrl] = useState('');

  const toggleMenu = () => {
    setMenuState(!isMenuOpen);
    if (menuRef.current) {
      if (!isMenuOpen) {
        menuRef.current.style.display = 'flex';
      } else {
        menuRef.current.style.display = 'none';
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      axios
        .post(baseUrl('api/open/create/link'), {
          options: {
            showLinkAfterDone: true,
            tinyUrl: true,
          },
        })
        .then((res) => {
          setUrl(res.data);
        });
    }
    fetchData();
  }, []);

  return (
    <nav className="cnw navigation">
      <div className="rnw jcsb navigation-top">
        <a href="https://videosupport.io" className="dpf logo-link">
          <Logo version="coloured" />
        </a>
        <div className="rnw jcc aic menu" onClick={toggleMenu}>
          {!isMenuOpen ? (
            <img
              src="/assets/record/humburger-buns-open.svg"
              alt="hamburger buns open"
              className="hamburger hamburger--open"
            />
          ) : (
            <img
              src="/assets/record/humburger-buns-close.svg"
              alt="hamburger buns close"
              className="hamburger hamburger--close"
            />
          )}
          <div className="menu-text">Menu</div>
        </div>
      </div>
      <div className="cnw navigation-content" ref={menuRef}>
        <div className="subheadline vsio-text--uppercase">Navigation</div>
        <ul className="cnw list">
          <NavItem
            icon={<VideoPlayer fill="#0b0b0b" />}
            label={'My videos'}
            link={'/my-videos'}
          />
          <NavItem
            icon={<Team fill="#0b0b0b" />}
            label={'My team'}
            link={'/my-team'}
          />
          <div className="divider" />
          <NavItem
            icon={<LightHouse fill="#0b0b0b" />}
            label={'Getting started'}
            link={'/getting-started'}
          />
          <NavItem
            icon={<FilmCamera fill="#0b0b0b" />}
            label={'Use cases'}
            link={'https://videosupport.io'}
            isExternal
          />
        </ul>
        <RecordingBanner
          title={"Record a new video, it's free :)"}
          button={{
            label: 'Record a new video',
            icon: <LogoMark fill="#fff" />,
            to: url,
            type: 'xs',
            style: 'primary',
            disabled: url && url.length === 0,
          }}
        />
      </div>
      <style jsx>{`
        .navigation {
          width: 100%;
          max-width: 20%;
          background: var(--white);
          padding: 40px 24px;
          border-right: 1px solid var(--light-gray);
        }

        .navigation-top {
          postion: relative;
          z-index: 3;
        }

        .logo-link {
          padding: 0 16px;
        }

        .menu {
          cursor: pointer;
          display: none;
        }

        .menu-text {
          font-weight: 500;
          text-transform: uppercase;
          font-size: var(--fs-md);
          margin-left: 6px;
        }

        .subheadline {
          margin-top: 56px;
          padding: 0 16px;
          margin-bottom: 16px;
        }

        .vsio-text--uppercase {
          color: var(--dark-gray);
        }

        .list {
          margin-bottom: 48px;
        }

        .divider {
          margin: 20px 0;
        }

        @media only screen and (max-width: 1240px) {
          .navigation {
            max-width: 100%;
          }

          .navigation-content {
            display: none;
            position: absolute;
            padding: 16px 24px 40px;
            top: 97px;
            right: 0;
            left: 0;
            width: 100%;
            background: var(--white);
            z-index: 2;
            border-top: 1px solid var(--light-gray);
          }

          .menu {
            display: flex;
          }

          .subheadline {
            margin-top: 16px;
          }
        }
      `}</style>
    </nav>
  );
};

export default SidebarNavigation;
