const formatVideo = (video) => {
  const ticketId = video.reservedMetadata.zendeskTicketId;
  let res = {
    id: video.id,
    date: video.recording.recordedAt,
    videoUrl: video.watchUrl,
    thumbnail: video.recording.thumbnailUrl,
  };
  if (ticketId) {
    res = {
      ticketCb: () => {
        zafClient.invoke('routeTo', 'ticket', ticketId);
      },
      ...res,
    };
  }
  return res;
};

export default formatVideo;
