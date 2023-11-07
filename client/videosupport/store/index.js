import React, { Component, createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Cookies } from 'cookies-js';
import decode from 'jwt-decode';

export const VideosupportContext = createContext({});

const DUMMY_DATA = [
  {
    id: 928328,
    headline: 'Customer Info',
    type: 'customer',
    items: [
      {
        text: 928328,
        headline: 'customer no°',
        type: 'text',
      },
      {
        text: 'Francis De Clercq',
        headline: 'name',
        type: 'text',
      },
      {
        text: 'francis@gmail.com',
        headline: 'email',
        type: 'text',
      },
      {
        text: '+32479174526',
        headline: 'phone',
        type: 'text',
      },
      {
        text: 'Hart Street 2527',
        headline: 'address',
        type: 'text',
      },
      {
        text: 'Middletown',
        headline: 'city',
        type: 'text',
      },
      {
        text: '06457',
        headline: 'postal code',
        type: 'text',
      },
    ],
  },
  {
    id: 5401253,
    headline: 'Product Info',
    type: 'product',
    items: [
      {
        text: 'R05401H19H0253',
        headline: 'serial no°',
        type: 'text',
      },
      {
        text: '9400298061',
        headline: 'order no°',
        type: 'text',
      },
      {
        text: 'Haier HW80-BP14636',
        headline: 'product name',
        type: 'text',
      },
      {
        text: 'Home & Garden',
        headline: 'category',
        type: 'tag',
      },
      {
        text: 'https://www.coolblue.be/nl/product/781953/haier-hw80-bp14636.html',
        headline: 'product page',
        type: 'url',
      },
    ],
  },
];

export class Store extends Component {
  constructor() {
    super();

    /* Development Process.
     * --------------------
     * All data on the /app/recording/:id page
     * is rendered with qrCode data. Make dev easy
     * by injecting that data without having to go through
     * the whole process (click, scan, record, send).
     */

    this.state = {
      recordingId: null,
      streamingUpload: true,
      data: [],
      videosupport: {},
      jwtcookie: null,
      language: {
        default: 'en',
        translations: {},
      },
      recording: {
        file: null,
        caption: null,
        videoUrl: null,
        thumbnailUrl: null,
        recordedAt: null,
        message: '',
        receiverEmail: '',
        isMuted: false,
        linkExpiration: null,
        desktop: false,
      },
      app: {
        branding: {
          logo: null,
          primaryColour: '#8614f8',
          secondaryColour: '#FFFFFF',
        },
        referrerUrl: 'https://videosupport.io/',
        submitDescription: 'Thank you for your video.',
      },
      device: {
        browser: null,
        os: null,
        isAvailable: true,
        mode: null,
      },
      db: {
        previousRecordedRefId: null,
        clientRefId: null,
      },
    };
  }

  setRecordingId = (recordingId) => {
    this.setState({
      recordingId: recordingId,
    });
  };

  setRecordingVideo = (videoUrl, thumbnailUrl, linkExpiration, callback) => {
    this.setState(
      {
        recording: {
          ...this.state.recording,
          videoUrl: videoUrl,
          thumbnailUrl: thumbnailUrl,
          linkExpiration: linkExpiration,
        },
      },
      callback
    );
  };

  setRecordingMessage = (msg) => {
    this.setState({ recording: { ...this.state.recording, message: msg } });
  };

  setRecordingSound = (value) => {
    this.setState({
      recording: {
        ...this.state.recording,
        isMuted:
          value !== undefined || value === false
            ? value
            : !this.state.recording.isMuted,
      },
    });
  };

  setRecordingDesktop = (value) => {
    // console.log('BS: changing setRecordingDesktop');
    this.setState({
      recording: {
        ...this.state.recording,
        desktop: !this.state.recording.desktop
      },
    });
  };

  setRestructuredUserAndProductData = (payload) => {
    const data = [];
    const customer = {
      id: uuidv4(),
      headline: 'Customer info',
      type: 'customer',
      items: [],
    };
    const product = {
      id: uuidv4(),
      headline: 'Product info',
      type: 'product',
      items: [],
    };
    const customerData = Object.entries(payload.user);

    if (payload.user.email && payload.user.email.length !== 0) {
      customerData.forEach(([key, value]) => {
        customer.items.push({
          type: 'text',
          headline: key,
          text: value,
        });
      });
      data.push(customer);
    }

    if (payload.customAttributes) {
      const customAttributesData = Object.entries(payload.customAttributes);
      if (Object.keys(payload.customAttributes).length !== 0) {
        customAttributesData.forEach(([key, value]) => {
          let type = 'text';
          let text = value;
          const modifiedKey = key.split('_').join(' ');
          if (typeof value === 'string') {
            if (
              value.indexOf('https://') !== -1 ||
              value.indexOf('http://') !== -1
            ) {
              type = 'url';
            }
          }
          if (typeof text === 'boolean') {
            text = `${value}`;
          }
          product.items.push({
            type,
            headline: modifiedKey,
            text,
          });
        });

        data.push(product);
      }
    }

    if (process.env.NODE_ENV === 'development') {
      this.setState({
        data: DUMMY_DATA,
      });
    } else {
      this.setState({
        data,
      });
    }
  };

  retrieveCookie = () => {
    const cookie = Cookies.get('videosupport-io-payload');
    if (cookie) {
      return cookie;
    } else if (this.state.jwtcookie) {
      return this.state.jwtcookie;
    } else {
      throw new Error("Can't find payload");
    }
  };

  restorePayload = () => {
    const jwt = this.retrieveCookie();
    this.setUrlPayload(jwt);
    return jwt;
  };

  setUrlPayload = (jwt) => {
    Cookies.set('videosupport-io-payload', jwt);

    this.setState({
      jwtcookie: jwt,
    });

    const payload = decode(jwt);

    // TODO(Joao): _check_v2
    // This should be deprecated
    let platform;
    if (payload.workspaceId !== undefined && payload.workspaceId !== null) {
      platform = 'intercom';
    } else if (payload.subdomain !== undefined) {
      platform = 'zendesk';
    } else if (payload.widgetId !== undefined) {
      platform = 'web';
    } else {
      platform = 'v2';
    }

    if (
      (payload.user && Object.values(payload.user).length !== 0) ||
      (payload.customAttributes &&
        Object.values(payload.customAttributes).length !== 0)
    ) {
      this.setRestructuredUserAndProductData(payload);
    }

    this.setState({
      videosupport: {
        platform: platform,
        ...payload,
      },
    });
  };

  setDeviceAvailability = (value) => {
    this.setState({ device: { ...this.state.device, isAvailable: value } });
  };

  setRecordingReceiverEmail = (email) => {
    this.setState({
      recording: { ...this.state.recording, receiverEmail: email },
    });
  };

  setDeviceSpecs = (specs) => {
    this.setState({
      device: {
        ...this.state.device,
        ...specs,
      },
    });
  };

  changeDeviceMode = () => {
    let newMode;
    if (this.state.device.mode === 'environment') {
      newMode = 'user';
    } else {
      newMode = 'environment';
    }
    this.setState({
      device: {
        ...this.state.device,
        mode: newMode,
      },
    });
  };

  setDbRecordingRefId = (id) => {
    this.setState({ db: { ...this.state.db, previousRecordedRefId: id } });
  };

  setDbClientRefId = (id) => {
    this.setState({ db: { ...this.state.db, clientRefId: id } });
  };

  setAppSubmitDescription = (description) => {
    this.setState({
      app: {
        ...this.state.app,
        submitDescription: description,
      },
    });
  };
  setAppBranding = (branding) => {
    this.setState({
      app: {
        ...this.state.app,
        branding: {
          ...this.state.app.branding,
          ...branding,
        },
      },
    });
  };
  setRecordingData = (props, callback) => {
    this.setState(
      {
        recording: {
          ...this.state.recording,
          ...props,
        },
      },
      () => {
        callback();
      }
    );
  };

  setStreamingUpload = (streaming) => {
    this.setState({
      streamingUpload: streaming,
    });
  };

  setTranslations = (language, translation) => {
    this.setState({
      language: {
        default: language,
        translations: translation,
      },
    });
  };

  render() {
    // console.debug('BS: render() in index.js');
    const value = {
      store: {
        state: this.state,
        setAppBranding: this.setAppBranding,
        setRecordingVideo: this.setRecordingVideo,
        setRecordingData: this.setRecordingData,
        setRecordingMessage: this.setRecordingMessage,
        setRecordingSound: this.setRecordingSound,
        setRecordingDesktop: this.setRecordingDesktop,
        restorePayload: this.restorePayload,
        retrieveCookie: this.retrieveCookie,
        setUrlPayload: this.setUrlPayload,
        setDeviceAvailability: this.setDeviceAvailability,
        setRecordingReceiverEmail: this.setRecordingReceiverEmail,
        setDbRecordingRefId: this.setDbRecordingRefId,
        setDeviceSpecs: this.setDeviceSpecs,
        setDbClientRefId: this.setDbClientRefId,
        setAppSubmitDescription: this.setAppSubmitDescription,
        setTranslations: this.setTranslations,
        setRecordingId: this.setRecordingId,
        setStreamingUpload: this.setStreamingUpload,
        changeDeviceMode: this.changeDeviceMode,
      },
    };

    return (
      <VideosupportContext.Provider value={value}>
        {this.props.children}
      </VideosupportContext.Provider>
    );
  }
}

// To use the store in functional components
export function useStore() {
  const { store } = useContext(VideosupportContext);
  return store;
}

// To use the store in class components
export function withStore(Component) {
  const Hoc = (props) => (
    <VideosupportContext.Consumer>
      {(store) => <Component {...props} {...store} />}
    </VideosupportContext.Consumer>
  );

  const componentName = Component.displayName || Component.name || 'Component';
  Hoc.displayName = `Wrapped${componentName}`;

  return Hoc;
}
