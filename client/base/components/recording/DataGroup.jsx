import React from 'react';
import { TweenMax, Power1 } from 'gsap';

import DataItem from './DataItem';

class DataGroup extends React.Component {
  constructor() {
    super();
    this.state = {
      active: false,
    };
  }

  toggle(evt) {
    evt.preventDefault();

    if (this.state.active) {
      this.collapse(this.toggleState.bind(this));
    } else {
      this.expand(this.toggleState.bind(this));
    }
  }

  toggleState() {
    this.setState({
      active: !this.state.active,
    });
  }

  expand(cb = () => {}) {
    TweenMax.set(this.accordionBody, { height: 'auto' });
    TweenMax.from(this.accordionBody, 0.3, {
      height: 0,
      ease: Power1.easeOut,
    });
    TweenMax.to(this.plusIconCenterRef, 0.3, {
      rotation: -90,
      transformOrigin: 'center',
      ease: Power1.easeInOut,
    });
    TweenMax.set(this.headerRef, {
      display: 'none',
    });
    cb();
  }

  collapse(cb = () => {}) {
    TweenMax.to(this.accordionBody, 0.3, {
      height: 0,
      ease: Power1.easeOut,
    });
    TweenMax.to(this.plusIconCenterRef, 0.3, {
      rotation: 0,
      ease: Power1.easeInOut,
    });
    TweenMax.set(this.headerRef, {
      display: 'flex',
    });
    cb();
  }

  render() {
    const activeClass = this.state.active ? 'expanded' : 'collapsed';

    return (
      <div className={`accordion__item ${activeClass}`}>
        <header
          className="dpf aic accordion__item__header"
          onClick={(t) => this.toggle(t)}
        >
          <h1 className={`accordion__item__headline`}>
            Tap me for {this.state.active ? 'less' : 'more'}
          </h1>
        </header>
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="10px"
          height="10px"
          viewBox="0 0 10 10"
          className="svg-expand__icon"
        >
          <path
            ref={(ref) => {
              this.plusIconCenterRef = ref;
            }}
            id="middle_1_"
            d="M5,10c-0.6,0-1-0.4-1-1V1c0-0.6,0.4-1,1-1s1,0.4,1,1v8C6,9.6,5.6,10,5,10z"
          />
          <path
            id="minus_1_"
            d="M9,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h8c0.6,0,1,0.4,1,1S9.6,6,9,6z"
          />
        </svg>
        <div
          ref={(r) => {
            this.accordionBody = r;
          }}
          className="accordion__item__body"
        >
          {Object.keys(this.props.items).map((key) => (
            <DataItem key={key} name={key} value={this.props.items[key]} />
          ))}
        </div>
        <style jsx>{`
          .accordion__item {
            position: relative;
            width: 100%;
            border-radius: 5px;
            padding: 0 16px 17px;
            background: #f7f7f7;
            border: 1px solid #e5e6e6;
          }

          .accordion__item__header {
            position: relative;
            padding: 20px 0 0;
            cursor: pointer;
          }

          .accordion__item__headline {
            font-weight: 500;
            font-size: 16px;
            line-height: 26px;
            color: #a1a1a1;
          }

          .accordion__item__body {
            height: 0;
            overflow: hidden;
          }

          .accordion__item + .accordion__item {
            margin-top: 16px;
          }

          .svg-expand__icon {
            position: absolute;
            top: 26px;
            right: 24px;
          }
        `}</style>
      </div>
    );
  }
}

export default DataGroup;
