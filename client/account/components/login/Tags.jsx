import React from 'react';

import Tag from './Tag';

const Tags = ({ tags }) => {
  return (
    <div className="dpf rw jcc aic tags">
      {tags &&
        tags.map((tag) => {
          return <Tag key={tag.key} {...tag} />;
        })}
      <style jsx>{`
        .tags {
          width: 100%;
          max-width: 531px;
          margin: 20px auto;
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default Tags;
