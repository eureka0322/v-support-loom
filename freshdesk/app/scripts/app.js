const BASE_URL = 'https://jvsio.eu.ngrok.io';
let TOKEN;

const baseUrl = (path) => {
  if (!path) return BASE_URL;
  else if (!path.startsWith('/')) return `${BASE_URL}/${path}`;
  else return `${BASE_URL}${path}`;
};

const getToken = async () => {
  const res = await client.request.get(baseUrl('/freshdesk/authenticate'), {
    // uncomment once we have account / authorized oauth
    /*
    headers: {
      Authorization: 'Bearer <%= access_token %>',
    },
    isOAuth: true,
    */
  });
  TOKEN = res.response;
};

const bearerToken = () => {
  return `Bearer ${TOKEN}`;
};

document.onreadystatechange = () => {
  const renderApp = () => {
    const getClient = (_client) => {
      window.client = _client;
      client.events.on('app.activated', renderWidget());
    };

    let onInit = app.initialized();
    onInit.then(getClient).catch(handleErr);
  };

  if (document.readyState === 'interactive') renderApp();
};

const requestVideo = () => {
  console.log('request video');
  client.request
    .post(baseUrl('/freshdesk/request-video'), {
      headers: {
        Authorization: bearerToken(),
      },
      body: JSON.stringify({
        conversationId: '1234',
      }),
    })
    .then((data) => {
      console.log(data);
    });
};

const renderWidget = async () => {
  await getToken();
  let requestElement = document.getElementById('request');
  let videosElement = document.getElementById('videos');
  requestElement.innerHTML = `
  <button onClick="requestVideo()">Request video</button><br>
  `;
  videosElement.innerHTML = `
  <b>Videos</b><br>
  No videos to show
  `;
};

const handleErr = (err = 'None') => {
  console.error(`Error occured. Details:`, err);
};
