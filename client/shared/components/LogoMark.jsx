import React from 'react';

const LogoMark = ({ fill }) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="46.2px"
      height="28px"
      viewBox="0 0 46.2 28"
    >
      <g id="logomark_2_">
        <path
          id="recorder_1_"
          className="st0"
          d="M9,17.1c-0.5-0.5-1.4-0.6-1.9-0.1s-0.6,1.4-0.1,1.9c2.1,2.2,5.7,3.5,9.6,3.5
		c3.9,0,7.6-1.3,9.6-3.5c0.5-0.5,0.5-1.4,0-1.9c-0.5-0.5-1.4-0.5-1.9,0c-1.5,1.6-4.4,2.6-7.7,2.6C13.5,19.7,10.5,18.6,9,17.1z M28,0
		c3,0,5.4,2.4,5.4,5.4v17.2c0,3-2.4,5.4-5.4,5.4H5.4c-3,0-5.4-2.4-5.4-5.4V5.4C0,2.4,2.4,0,5.4,0H28z"
        />
        <path
          id="lens_1_"
          className="st0"
          d="M43,22.3l-6.2-2c-1-0.3-1.7-1.3-1.7-2.3V10c0-1,0.7-2,1.6-2.3l6.2-2.1c1.6-0.5,3.2,0.6,3.2,2.3
		v12.1C46.2,21.6,44.6,22.8,43,22.3"
        />
      </g>
      <style jsx>{`
        .st0 {
          fill-rule: evenodd;
          clip-rule: evenodd;
          fill: ${fill};
        }
      `}</style>
    </svg>
  );
};

export default LogoMark;
