const debug = {
  showDebug: process.env.NODE_ENV === 'development' ? true : false,
  totalFrames: 0,
}

export default debug;