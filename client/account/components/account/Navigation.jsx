import React from 'react';
import { NavLink } from 'react-router-dom';

import {
  Overview,
  Settings,
  ColourPicker,
  Videos,
  Team,
  Link,
  Billing,
  PriceTag,
} from '../../../shared/icons/';

import { AccountStore, useAccountStore } from '../../store';


const Navigation = () => {
  const store = useAccountStore();
  // console.log('store.state', store.state)
  // console.log('store.state.client.pricingPlan', store.state.client.pricingPlan)
  // const has_plan = store.state.client.pricingPlan.toLowerCase() == 'trial' || store.state.client.pricingPlan.toLowerCase() == 'prepricing';
  // console.log('has_plan', has_plan)
  return (
    <nav className="dpf nav">
      <ul className="dpf cnw list">
        <li className="list__item">
          <NavLink
            to={`/overview`}
            className="dpf aic dashboard__list__item__link"
            activeclassname="dashboard__list__item__link--active"
          >
            <Overview />
            <span className="dashboard__list__item__label">Overview</span>
          </NavLink>
        </li>
        <li className="list__item">
          <NavLink
            to={store.state?.client?.pricingPlan == 'trial' || store.state?.client?.pricingPlan == 'prepricing' ? `/branding` : `/billing`}
            className="dpf aic dashboard__list__item__link"
            activeclassname="dashboard__list__item__link--active"
          >
            <ColourPicker />
            <span className="dashboard__list__item__label">Branding{!store.state?.client?.pricingPlan == 'trial' || store.state?.client?.pricingPlan == 'prepricing' ? `` : <sup><PriceTag /></sup>}</span>
            
          </NavLink>
        </li>
        <li className="list__item">
          <NavLink
            to={`/videos`}
            className="dpf aic dashboard__list__item__link"
            activeclassname="dashboard__list__item__link--active"
          >
            <Videos />
            <span className="dashboard__list__item__label">Videos</span>
          </NavLink>
        </li>
        <li className="list__item">
          <NavLink
            to={store.state?.client?.pricingPlan == 'trial' || store.state?.client?.pricingPlan == 'prepricing' ? `/api` : `/billing`}
            className="dpf aic dashboard__list__item__link"
            activeclassname="dashboard__list__item__link--active"
          >
            <Link />
            <span className="dashboard__list__item__label">Video Request Link{!store.state?.client?.pricingPlan == 'trial' || store.state?.client?.pricingPlan == 'prepricing' ? `` : <sup><PriceTag /></sup>}</span>
          </NavLink>
        </li>
        <li className="list__item">
          <NavLink
            to={`/settings`}
            className="dpf aic dashboard__list__item__link"
            activeclassname="dashboard__list__item__link--active"
          >
            <Settings fill="#0b0b0b" />
            <span className="dashboard__list__item__label">Settings</span>
          </NavLink>
        </li>
        <li className="list__item">
          <NavLink
            to={`/billing`}
            className="dpf aic dashboard__list__item__link"
            activeClassName="dashboard__list__item__link--active"
          >
            <Billing />
            <span className="dashboard__list__item__label">Billing</span>
          </NavLink>
        </li>
        <li className="list__item">
          <NavLink
            to={store.state?.client?.pricingPlan == 'trial' || store.state?.client?.pricingPlan == 'prepricing' ? `/team` : `/billing`}
            className="dpf aic dashboard__list__item__link"
            activeclassname="dashboard__list__item__link--active"
          >
            <Team />
            <span className="dashboard__list__item__label">Team{!store.state?.client?.pricingPlan == 'trial' || store.state?.client?.pricingPlan == 'prepricing' ? `` : <sup><PriceTag /></sup>}</span>
          </NavLink>
        </li>
      </ul>

      <style jsx global={true}>{`
        .dashboard__list__item__link {
          color: #0b0b0b;
          padding: 16px 24px;
          border-radius: 5px;
        }

        .dashboard__list__item__link--secondary {
          border: 1px solid #e5e6e6;
          justify-content: center;
        }
        .dashboard__list__item__link--secondary svg {
          margin-left: -8px;
        }

        .dashboard__list__item__link:hover {
          background: rgba(11, 11, 11, 0.04);
        }

        .dashboard__list__item__link--secondary:hover {
          background: transparent;
          border: 1px solid rgba(11, 11, 11, 0.5);
        }

        .dashboard__list__item__link--active {
          color: #8614f8;
          fill: #8614f8;
          background: #f5ebfe;
        }
        .dashboard__list__item__link--active:hover {
          background: #f5ebfe;
        }
        .dashboard__list__item__label {
          position: relative;
          top: 1px;
          font-size: 16px;
          line-height: 12px;
          margin-left: 16px;
        }

        @media only screen and (max-width: 1050px) {
          .dashboard__list__item__link {
            justify-content: center;
          }
          .dashboard__list__item__label {
            display: none;
          }
        }
      `}</style>
      <style jsx>{`
        .nav {
          width: 100%;
          margin-top: 64px;
        }

        .list {
          width: 100%;
        }

        .list__item + .list__item {
          margin-top: 16px;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
