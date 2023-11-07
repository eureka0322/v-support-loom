import React from 'react';
import Logo from './Logo';

const Footer = ({ style = 'light' }) => {
  return (
    <footer className={`dpf footer footer--${style}`}>
      <div className="dpf rnw jcsb aic footer__container">
        <a href="https://www.videosupport.io" className="dpf link logo__link">
          <Logo version="dark" />
        </a>
        <ul className="dpf rw aic list">
          <li className="list__item">
            <a
              href="mailto:hello@videosupport.io"
              className="dpf footer__link footer__list__link__item"
            >
              Contact
            </a>
          </li>
          <li className="list__item">
            <a
              href="https://www.videosupport.io/privacy"
              target="_blank"
              rel="noreferrer"
              className="dpf footer__link footer__list__link__item"
            >
              Privacy
            </a>
          </li>
          <li className="list__item">
            <a
              href="https://www.videosupport.io/terms-of-service"
              target="_blank"
              rel="noreferrer"
              className="dpf footer__link footer__list__link__item"
            >
              Terms of Service
            </a>
          </li>
        </ul>
        <div className="dpf rw socials">
          <a
            href="https://www.linkedin.com/company/videosupportio/"
            className={`dpf social-link`}
            target="_blank"
            rel="noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="24px"
              height="24px"
              className={`social-link-icon--${style}`}
            >
              <path d="M 11.5 6 C 8.4802259 6 6 8.4802259 6 11.5 L 6 36.5 C 6 39.519774 8.4802259 42 11.5 42 L 36.5 42 C 39.519774 42 42 39.519774 42 36.5 L 42 11.5 C 42 8.4802259 39.519774 6 36.5 6 L 11.5 6 z M 11.5 9 L 36.5 9 C 37.898226 9 39 10.101774 39 11.5 L 39 36.5 C 39 37.898226 37.898226 39 36.5 39 L 11.5 39 C 10.101774 39 9 37.898226 9 36.5 L 9 11.5 C 9 10.101774 10.101774 9 11.5 9 z M 15.5 13 A 2.5 2.5 0 0 0 15.5 18 A 2.5 2.5 0 0 0 15.5 13 z M 14 20 C 13.447 20 13 20.447 13 21 L 13 34 C 13 34.553 13.447 35 14 35 L 17 35 C 17.553 35 18 34.553 18 34 L 18 21 C 18 20.447 17.553 20 17 20 L 14 20 z M 21 20 C 20.447 20 20 20.447 20 21 L 20 34 C 20 34.553 20.447 35 21 35 L 24 35 C 24.553 35 25 34.553 25 34 L 25 26.5 C 25 25.121 26.121 24 27.5 24 C 28.879 24 30 25.121 30 26.5 L 30 34 C 30 34.553 30.447 35 31 35 L 34 35 C 34.553 35 35 34.553 35 34 L 35 26 C 35 22.691 32.309 20 29 20 C 27.462 20 26.063 20.586016 25 21.541016 L 25 21 C 25 20.447 24.553 20 24 20 L 21 20 z" />
            </svg>
          </a>
        </div>
      </div>
      <style jsx>{`
        .footer {
          width: 100%;
          margin-top: 68px;
        }

        .footer--light {
          border-top: 1px solid #e5e6e6;
        }

        .footer--dark {
          border-top: 1px solid #1a1a1a;
        }

        .footer__container {
          width: 100%;
          padding: 24px;
        }

        .logo--light {
          fill: #0b0b0b;
        }
        .logo--dark {
          fill: #fff;
        }

        .list {
          margin-left: -57px;
        }

        .social-link-icon--light {
          fill: #0b0b0b;
        }

        .social-link-icon--dark {
          fill: white;
        }

        .logo__link,
        .social-link {
          transition: opacity 0.3s ease-in-out;
        }

        .logo__link:hover,
        .social-link:hover {
          opacity: 0.5;
        }

        .social-link + .social-link {
          margin-left: 16px;
        }

        @media only screen and (max-width: 1300px) {
          .footer--light {
            border-bottom: 1px solid #e5e6e6;
          }

          .footer--dark {
            border-bottom: 1px solid #1a1a1a;
          }
        }

        @media only screen and (max-width: 768px) {
          .footer__container,
          .list {
            flex-flow: column nowrap;
          }

          .footer__container {
            padding: 40px 16px;
          }

          .list {
            padding: 40px 0;
            margin: 0;
          }

          .list__item + .list__item {
            margin-top: 24px;
          }

          .social-link + .social-link {
            margin-left: 32px;
          }
        }
      `}</style>
      <style jsx global="true">{`
        .footer__list__link__item {
          font-size: 14px;
          color: #a1a1a1;
          padding: 0 12px 3px 12px;
        }

        .footer__list__link__item:hover {
          text-decoration: underline;
          text-underline-position: under;
        }

        .footer__list__link__item--active {
          color: #8614f8;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
