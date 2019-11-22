const getLink = (prefix, productPrefix) => {
  const { host } = window.location;
  const prodPrefix = productPrefix || prefix;
  if (host.indexOf('office') !== -1) {
    return `//${prefix}.office.bzdev.net`;
  }
  if (host.indexOf('online') !== -1) {
    return `//${prefix}.online.seedit.cc`;
  }
  return `//${prodPrefix}.bozhong.com`;
};

export default getLink;
