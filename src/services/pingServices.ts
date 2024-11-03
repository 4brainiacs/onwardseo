// Version 1.2.13 - Updated with HTTPS and CORS handling
export const PING_SERVICES = [
  // Global Services
  { 
    name: 'Pingomatic',
    url: 'https://rpc.pingomatic.com'
  },
  {
    name: 'Weblogs',
    url: 'https://rpc.weblogs.com/RPC2'
  },
  {
    name: 'Feedburner',
    url: 'https://ping.feedburner.com'
  },
  {
    name: 'Google Feedburner',
    url: 'https://feedburner.google.com/fb/a/pingSubmit'
  },
  {
    name: 'Weblogs Form',
    url: 'https://rpc.weblogs.com/pingSiteForm'
  },

  // Search Engine Services
  {
    name: 'Bing Webmaster',
    url: 'https://www.bing.com/webmaster/ping.aspx'
  },
  {
    name: 'Google Blog Search',
    url: 'https://blogsearch.google.com/ping/RPC2'
  },
  {
    name: 'Google India',
    url: 'https://blogsearch.google.co.in/ping/RPC2'
  },
  {
    name: 'Google Italy',
    url: 'https://blogsearch.google.co.it/ping/RPC2'
  },
  {
    name: 'Yandex Blogs',
    url: 'https://ping.blogs.yandex.ru/RPC2'
  },

  // RSS Services
  {
    name: 'RSS Blog Update',
    url: 'https://rpc.rsswebupdate.com/ping'
  },
  {
    name: 'Syndic8',
    url: 'https://ping.syndic8.com/xmlrpc.php'
  },
  {
    name: 'Moreover',
    url: 'https://api.moreover.com/ping'
  },
  {
    name: 'NewsGator',
    url: 'https://services.newsgator.com/ngws/xmlrpcping.aspx'
  },
  {
    name: 'Feed Submitter',
    url: 'https://www.feedsubmitter.com'
  },
  {
    name: 'Yahoo Updates',
    url: 'https://api.my.yahoo.com/rss/ping'
  },

  // Blog Directory Services
  {
    name: 'Blogdigger',
    url: 'https://www.blogdigger.com/RPC2'
  },
  {
    name: 'BlogStreet',
    url: 'https://www.blogstreet.com/xrbin/xmlrpc.cgi'
  },
  {
    name: 'Technorati',
    url: 'https://rpc.technorati.com/rpc/ping'
  },
  {
    name: 'Feedster',
    url: 'https://api.feedster.com/ping'
  },

  // Asian Services
  {
    name: 'BlogsJapan',
    url: 'https://ping.bloggers.jp/rpc'
  },
  {
    name: 'FC2',
    url: 'https://ping.fc2.com'
  },
  {
    name: 'Drecom',
    url: 'https://ping.rss.drecom.jp'
  },

  // European Services
  {
    name: 'Twingly',
    url: 'https://rpc.twingly.com'
  },

  // Blog Platform Services
  {
    name: 'WordPress',
    url: 'https://rpc.wordpress.com'
  },
  {
    name: 'TypePad',
    url: 'https://rpc.typepad.com'
  }
];