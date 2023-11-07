import React from 'react';

const DataItem = ({ name, value }) => {
  const renderUrl = (link) => {
    if (link) {
      const urlText = link.split('/');
      return urlText[2];
    }
  };

  const formatName = (val) => {
    const formatted = val.replaceAll('_', ' ');
    return formatted;
  };

  const renderText = (val) => {
    const asText = `${val}`;
    if (asText.indexOf('http://') !== -1 || asText.indexOf('https://') !== -1) {
      return (
        <a
          href={val}
          target="_blank"
          rel="noreferrer"
          className="data-item__text data-item__link"
        >
          {renderUrl(asText)}
        </a>
      );
    } else {
      return <p className="data-item__text">{asText}</p>;
    }
  };

  return (
    <div className={`dpf cnw data__item`}>
      <header className="header">
        <h1 className="headline">{formatName(name)}</h1>
        {renderText(value)}
      </header>
      <style jsx>{`
        .data__item {
          margin: 16px 0 0;
        }
        .headline {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #babebe;
        }
      `}</style>
      <style jsx global="true">{`
        .data-item__text {
          font-size: 16px;
          line-height: 26px;
          word-break: break-word;
        }

        .data-item__link {
          text-decoration: underline;
          color: #0090e3;
        }
      `}</style>
    </div>
  );
};

export default DataItem;
