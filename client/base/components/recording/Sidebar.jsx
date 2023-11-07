import React, { useEffect } from 'react';

import Note from './Note';
import DataGroup from './DataGroup';

const Sidebar = ({
  customer,
  metadata,
  note,
  voiceMemo,
  recording,
  side,
  assigned,
}) => {
  return (
    <section className={`dpf cnw data`}>
      {metadata &&
        Object.keys(metadata).length === 0 &&
        !voiceMemo &&
        note &&
        note.length === 0 && (
          <div className="empty__state">
            <header className="header">
              <h1 className="headline">Sidebar</h1>
            </header>
            <div className="description">
              No note, customer or product info available.
            </div>
          </div>
        )}
      {voiceMemo && voiceMemo.length !== 0 && (
        <div className="voicememo">
          <header className="header">
            <h1 className="headline">Note</h1>
          </header>
          <div className="description">
            <audio className="audio" src={voiceMemo} controls />
          </div>
        </div>
      )}
      {note && note.length !== 0 && <Note text={note} type={recording.type} />}
      {customer && (
        <article className="dpf cnw data__article">
          <header className="dpf header">
            <h1 className="headline">Customer information</h1>
          </header>
          <div className="dpf content">
            <DataGroup items={customer} />
          </div>
        </article>
      )}
      {metadata && side === 'support' && (
        <article className="dpf cnw data__article">
          <header className="dpf header">
            <h1 className="headline">Product information</h1>
          </header>
          <div className="dpf content">
            <DataGroup items={metadata} />
          </div>
        </article>
      )}
      <style jsx>{`
        .data {
          width: 321px;
        }

        .header {
          margin-bottom: 8px;
        }

        .data__article {
          width: 100%;
        }

        .data__article + .data__article {
          margin-top: 24px;
        }

        .headline {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .description {
          line-height: 24px;
        }

        .content {
          width: 100%;
        }

        .voicememo {
          width: 100%;
          margin-bottom: 24px;
        }

        .audio {
          width: 100%;
        }

        @media only screen and (max-width: 768px) {
          .data {
            width: 100%;
            margin-top: 24px;
          }
        }
      `}</style>
    </section>
  );
};

export default Sidebar;
