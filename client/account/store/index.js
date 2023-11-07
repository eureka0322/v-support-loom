import React, { Component, createContext, useContext } from 'react';

export const VideosupportAccountContext = createContext({});

export class AccountStore extends Component {
  constructor() {
    super();
    this.state = {
      client: {
        id: null,
        name: null,
        pricingPlan: null,
        recordingAmount: null,
        settings: {
          app: {
            branding: {
              primary_colour: null,
              secondary_colour: null,
            },
            referrerUrl: null,
          },
          integrations: null,
          seats: null,
        },
      },
      user: {
        id: '',
        name: '',
        email: '',
        photo: undefined,
      },
      bearer: null,
    };
  }
  setClientBranding = (primaryColour, secondaryColour, logo) => {
    const client = {
      client: {
        ...this.state.client,
        settings: {
          ...this.state.client.settings,
          app: {
            ...this.state.client.settings.app,
            branding: {
              ...this.state.client.settings.app.branding,
              primary_colour: primaryColour,
              secondary_colour: secondaryColour,
              logo: logo,
            },
          },
        },
      },
    };
    this.setState(client);
  };

  setClientBrandingLogo = (logo) => {
    const client = {
      client: {
        ...this.state.client,
        settings: {
          ...this.state.client.settings,
          app: {
            ...this.state.client.settings.app,
            branding: {
              ...this.state.client.settings.app.branding,
              logo: logo,
            },
          },
        },
      },
    };

    this.setState(client);
  };
  setClientSettings = ({ referrerUrl }) => {
    const client = {
      client: {
        ...this.state.client,
        settings: {
          ...this.state.client.settings,
          app: {
            ...this.state.client.settings.app,
            referrerUrl: referrerUrl,
          },
        },
      },
    };
    this.setState(client);
  };
  setUserData = ({ id, name, email, photo }) => {
    this.setState({
      user: {
        id: id,
        name: name,
        email: email,
        photo: photo,
      },
    });
  };
  setOrganizationData = (client) => {
    const nextState = {
      client: client,
    };
    this.setState(nextState);
  };
  removeSeat = (data) => {
    this.setState({
      client: {
        ...this.state.client,
        seats: {
          ...this.state.client.seats,
          teammates: data,
        },
      },
    });
  };
  setBearerToken = (bearer) => {
    this.setState({
      bearer,
    });
  };
  render() {
    const value = {
      store: {
        state: this.state,
        removeSeat: this.removeSeat,
        setBearerToken: this.setBearerToken,
        setClientBranding: this.setClientBranding,
        setClientBrandingLogo: this.setClientBrandingLogo,
        setClientSettings: this.setClientSettings,
        setOrganizationData: this.setOrganizationData,
        setUserData: this.setUserData,
      },
    };

    return (
      <VideosupportAccountContext.Provider value={value}>
        {this.props.children}
      </VideosupportAccountContext.Provider>
    );
  }
}

// To use the store in functional components
export function useAccountStore() {
  const { store } = useContext(VideosupportAccountContext);
  return store;
}
