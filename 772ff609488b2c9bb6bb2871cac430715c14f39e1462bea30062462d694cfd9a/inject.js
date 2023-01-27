// some random script i found, im not sure why im putting it here
(function() {
  if (window.top === window.self) {
    console.log('[LS Filter] -> ' + window.location.href);
    const tabId = Math.random() * 16;
    let currentUrl, killYTAutoplayInt, hideYTAvatarInt, failedRetry;

    const saTicker = function () {
      if ((currentUrl !== window.location.href) || failedRetry) {
        saReport();
        checkYoutube();
        currentUrl = window.location.href;
      }
    };
    setInterval(saTicker, 1000);

    const saReport = function () {
      const xhr = new XMLHttpRequest();
      const body = {
        url: window.location.href,
        tabId: tabId,
				guid: '7271adf6-c870-4451-a7fa-b7b23f4f0bfd'
      };
      console.log('[LS Filter] logging -> ' + JSON.stringify(body));
      xhr.open('POST', document.location.origin + '/772ff609488b2c9bb6bb2871cac430715c14f39e1462bea30062462d694cfd9a/log', true);
      xhr.send(JSON.stringify(body));
    };

    const checkYoutube = function() {
      if (window.location.href.match(/(^|\.)youtube\./)) {
        console.log('[LS Filter] YouTube detected');
        applyYouTube();
      };
    }

    const applyYouTube = function () {
      const xhr = new XMLHttpRequest();
      const body = {
        code: 'settings',
        url: window.location.href
      };
      xhr.open('POST', document.location.origin + '/772ff609488b2c9bb6bb2871cac430715c14f39e1462bea30062462d694cfd9a/ytconf', true);
      xhr.send(JSON.stringify(body));
      xhr.onreadystatechange = function () {
        if (this.status === 200 && xhr.responseText) {
					failedRetry = false;
          const ytSettings = JSON.parse(xhr.responseText);
          console.log('[LS Filter] YouTube settings -> ' + JSON.stringify(ytSettings));
          if (ytSettings.redirect && ytSettings.redirect != '') {
            window.location.href = ytSettings.redirect;
          } else {
            configureYoutube(ytSettings);
          }
        } else {
					failedRetry = true;
				}
      };
    };

    const killMiniPlayers = function() {
			const vc = document.getElementById('video-preview-container');
			if (vc) {
				vc.remove();
			}
			const mp = document.getElementsByTagName('ytd-miniplayer');
			if (mp.length > 0) {
				mp[0].remove();
			}
			document.querySelectorAll('div#mouseover-overlay').forEach((d) => { d.remove(); });
			document.querySelectorAll('div#hover-overlays').forEach((d) => { d.remove(); });
		};
		
		const configureYoutube = function(ytSettings) {
			if (typeof(ytSettings) === 'undefined') { return;}
		
			const style = document.createElement('STYLE');
			style.type = 'text/css';
			style.innerText = '';
			if (ytSettings.hide_sidebar) {
				console.debug('[LS Filter] hide sidebar');
				style.innerText += '.watch-sidebar, .ytd-watch-next-secondary-results-renderer {display: none !important;}\n';
			}
			if (ytSettings.hide_comments) {
				console.debug('[LS Filter] hide comments');
				style.innerText += '#watch-discussion, .watch-discussion, ytd-comments {display: none !important;}\n';
			}
			if (style.innerText !== '') {
				let head = document.getElementsByTagName('head');
				if (head && head.length > 0) {
					head = head[0];
					head.append(style);
				}
			}
		
			if (ytSettings.disable_chan_autoplay) {
				console.debug('[LS Filter] disable autoplay');
				if (typeof(killYTAutoplayInt) !== 'undefined') {
					clearInterval(killYTAutoplayInt);
					killYTAutoplayInt = undefined;
				}
				killYTAutoplay();
				killYTAutoplayInt = setInterval(killYTAutoplay, 1000);
			}
		
			if (ytSettings.block_thumbnails) {
				console.debug('[LS Filter] block thumbnails');
				if (typeof(hideYTAvatarInt) !== 'undefined') {
					clearInterval(hideYTAvatarInt);
					hideYTAvatarInt = undefined;
				}
				hideYTAvatars();
				hideYTAvatarInt = setInterval(hideYTAvatars, 1000);
			}
		
			console.debug('[LS Filter] hide miniplayers');
			if (typeof(killMiniPlayerInt) !== 'undefined') {
				clearInterval(killMiniPlayerInt);
				killMiniPlayerInt = undefined;
			}
			killMiniPlayers();
			killMiniPlayerInt = setInterval(killMiniPlayers, 1000);
		};

    const blockYTImg = '/772ff609488b2c9bb6bb2871cac430715c14f39e1462bea30062462d694cfd9a/blocked-image-search.png';
    function hideYTAvatars() {
      const a = [...document.querySelectorAll('#avatar')];
      a.forEach((t) => {
        [...t.getElementsByTagName('img')].forEach((i) => {
          if (i.src !== blockYTImg) {
            console.log(i.src);
            i.src = blockYTImg;
          }
        });
      });
    };

    let paused = false;
		const killYTAutoplay = function() {
			const a = document.createElement('A');
			a.href = window.location.href;
			if (a.hostname.match(/(^|\.)youtube\./)) {
				if (
					a.pathname.match(/^\/user\/[^\/\?]+$/)
					||
					a.pathname.match(/^\/channel\/[^\/\?]+$/)
					||
					a.pathname.match(/^\/c\/[^\/\?]+$/)
					||
					a.pathname.match(/\/featured$/)
				) {
					if (paused) {
						const mp = document.getElementsByTagName('ytd-channel-video-player-renderer');
						if (mp.length > 0) {
							console.debug('[LS Filter] remove autoplay');
							mp[0].remove();
							paused = false;
						}
					}
					const v = document.getElementsByTagName('video');
					if (v.length > 0) {
						for (i in v) {
							if (typeof(v[i].pause) === 'function') {
								if (!v[i].paused) {
									console.debug('[LS Filter] pause autoplay');
									v[i].pause();
									paused = true;
								}
							} 
						};
					}
				}
			}
		};

    saTicker();
  }
}).call(this);


(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
	window.relay_log = 'debug'
	const a = document.createElement('A');
	a.href = window.location.href;
	const FlagEngine = require('./in_page/in_page_flags');
	
	const setupFlagScanning = function(terms, ignoredSites, mode) {
		if (window.relay_log === 'debug') { console.debug('[LS Filter] setup flag scanning');}
		if (!Array.isArray(ignoredSites)) { ignoredSites = [];}
		if (terms && terms.length > 0) {
			if (window.relay_log === 'debug') { console.debug('[LS Filter] terms found'); }
			let scanInterval;
			const flagger = new FlagEngine(a);
			flagger.Initialize(terms, ignoredSites, mode).then(() => {
				if (mode !== 'intent') {
					console.debug('[LS Filter] page scanning');
					if (typeof(scanInterval) !== 'undefined') {
						clearInterval(scanInterval);
					}
					const scanAndReport = () => {
						if (window.relay_log === 'debug') { console.debug('[LS Filter] scanAndReport'); }
						try {
							// Make sure we are up to date on our url
							if (window.location.href !== a.href) {
								if (window.relay_log === 'debug') { console.debug('[LS Filter] location changed'); }
								a.href = window.location.href;
							}
							const flags = flagger.Scan();
							if (Array.isArray(flags) && flags.length > 0) {
								if (window.relay_log === 'debug') { console.debug('[LS Filter] scanning found flags, reporting them: ', flags); }
								flagger.Report(flags);
							}
						} catch (e) {
							console.error(e);
						}
					};
					scanInterval = setInterval(scanAndReport, 5000);
					scanAndReport();
				}
			}).catch(console.error);
		}
	};
	setupFlagScanning(["suicide","glype","proxy","Anarchist cookbook","Become a terrorist","Binge and purge","binging and purging","Blow up school","Bitch","Bong rips","Bulimia ","Buy alcohol underage","Buy gun","Buy knives","commit suicide","Cock","Cunt","Cutting yourself","Dumb bitch","Dumbass","Dyke","Faggot","Gun in school","Fuck you","Heroin","Homemade bomb","How to hang yourself","How to become anorexic","How to get revenge","How to join a gang","How to join ISIS","How to kill","How to make myself throw up","How to sext","How to sneak things past security","I hate myself","I want to cut myself","kill you","Kill myself","I want to die","Make a bomb","Make a bong","Murder suicide","My life is shit","My life is worthless","Naked girls","Naked pics","nigga","Nigger","Pipe bomb","Porn","Pussy","Queer","Rape","Retard","Sex online","Slut","Smoke weed","Sneak gun in school","Suicide","Suicide bomb","Suicide by cop","Suicide vest","Where to buy drugs","White pride","Whore"], {"docs.google.com":{"matcher":"docs.google.com","mode":"page"}}, 'intent');
	
	},{"./in_page/in_page_flags":5}],2:[function(require,module,exports){
	class FacebookFlags {
		constructor(urlObject) {
			if (typeof(urlObject) === 'undefined') { throw new Error('URL OBject required');}
			this.disabled = true;
			this.moduleName = 'facebook';
			if (urlObject.hostname.match(/\.?facebook\.com$/i)) {
				this.disabled = false;
			}
		}
	
		GatherIntent() {
			if (this.disabled) { return;}
			const ret = [];
			const elements = document.querySelectorAll('[data-text="true"]');
			elements.forEach((e) => {
				ret.push(e.innerText);
			});
			return ret;
		}
	}
	
	module.exports = FacebookFlags;
	
	},{}],3:[function(require,module,exports){
	class GmailFlags {
		constructor(urlObject) {
			if (typeof(urlObject) === 'undefined') { throw new Error('URL OBject required');}
			this.disabled = true;
			this.moduleName = 'gmail';
			if (urlObject.hostname.match(/mail\.google\.com$/i)) {
				this.disabled = false;
			}
		}
	
		GatherIntent() {
			if (this.disabled) { return;}
			const ret = [];
			const elements = document.querySelectorAll('[role="textbox"]');
			elements.forEach((e) => {
				ret.push(e.innerText);
			});
			return ret;
		}
	}
	
	module.exports = GmailFlags;
	
	},{}],4:[function(require,module,exports){
	class GoogleDoc {
		constructor(urlObject) {
			if (typeof(urlObject) === 'undefined') { throw new Error('URL OBject required');}
			this.disabled = true;
			this.moduleName = 'google_doc';
			if (urlObject.hostname.match(/docs\.google\.com$/i)) {
				this.disabled = false;
			}
		}
	
		GatherIntent() {
			if (this.disabled) { return;}
			const ret = [document.body.innerText];
			return ret;
		}
	}
	
	module.exports = GoogleDoc;
	
	},{}],5:[function(require,module,exports){
	const supportedDOMEvents = ['change', 'keyup'];
	const FB = require('./facebook_flags');
	const Twitter = require('./twitter_flags');
	const Gmail = require('./gmail_flags');
	const GoogleDoc = require('./google_doc_flags');
	const MSOffice = require('./ms_office_flags');
	class Flags {
		constructor(urlObject) {
			if (typeof(urlObject) === 'undefined') {
				throw new Error('url object required');
			}
			this.UrlObject = urlObject;
			this.terms = [];
			this.lastBodyText = '';
			this.target = {};
			this.initialized = false;
			this.reportedTerms = {};
			this.modules = [];
			const fbModule = new FB(urlObject);
			if (!fbModule.disabled) {
				this.modules.push(fbModule);
			}
			const twitterModule = new Twitter(urlObject);
			if (!twitterModule.disabled) {
				this.modules.push(twitterModule);
			}
			const gmailModule = new Gmail(urlObject);
			if (!gmailModule.disabled) {
				this.modules.push(gmailModule);
			}
			const googleDocModule = new GoogleDoc(urlObject);
			if (!googleDocModule.disabled) {
				this.modules.push(googleDocModule);
			}
			const msOfficeModule = new MSOffice(urlObject);
			if (!msOfficeModule.disabled) {
				this.modules.push(msOfficeModule);
			}
		}
	
		DOMExtractAndScan(event) {
			if (typeof(event.target) === 'undefined') { throw new Error('event has no target');}
			let values;
			let scanType;
			switch (event.type) {
			case 'scan':
				scanType = 'GatherIntent';
				break;
			default:
				scanType = event.target.tagName.toLowerCase();
				break;
			}
	
			switch (scanType) {
			case 'input':
				let type = event.target.type || 'text';
				type = type.toLowerCase();
				// Dont scan password fields
				if (type === 'password') { break;}
				values = [event.target.value];
				break;
			case 'textarea':
				values = [event.target.value];
				break;
			default:
				values = [];
				this.modules.forEach((module) => {
					if (typeof(module.GatherIntent) === 'function') {
						const intent = module.GatherIntent();
						if (typeof(intent) === 'string') {
							values.push(intent);
						} else if (Array.isArray(intent)) {
							values = values.concat(intent);
						}
					}
				});
				break;
			}
			if (typeof(values) !== 'undefined') {
				values.forEach((value) => {
					if (value === '') {
						this.target.RelayFlaggedTerms = {};
					} else {
						if (typeof(this.target.RelayFlaggedTerms) === 'undefined') {
							this.target.RelayFlaggedTerms = {};
						}
						const flags = this.Scan(value);
						const toReport = [];
						flags.forEach((flag) => {
							const term = flag[0];
							const cnt = flag[1];
							flag[2] = true; // mark it as user entered
							if (typeof(this.target.RelayFlaggedTerms[term]) === 'undefined') {
								this.target.RelayFlaggedTerms[term] = cnt;
								toReport.push(flag);
							} else {
								if (this.target.RelayFlaggedTerms[term] < cnt) {
									// Only report the new difference
									flag[1] = cnt - this.target.RelayFlaggedTerms[term];
									this.target.RelayFlaggedTerms[term] += flag[1];
									toReport.push(flag);
								}
							}
						});
						if (toReport.length > 0) {
							this.Report(toReport);
						}
					}
				});
			}
		}
	
		HandleDOM_change(event) {
			if (typeof(event) === 'undefined') { throw new Error('event required');}
			if (event.type !== 'change') { throw new Error('event must be a change event');}
			if (typeof(event.target) === 'undefined') { throw new Error('event has no target');}
			if (typeof(event.target.tagName) === 'undefined') { return;}
			if (this.ShouldIgnore()) { return;}
			this.DOMExtractAndScan(event);
		}
	
		HandleDOM_keyup(event) {
			if (typeof(event) === 'undefined') { throw new Error('event required');}
			if (event.type !== 'keyup') { throw new Error('event must be a keyup event');}
			if (typeof(event.target) === 'undefined') { throw new Error('event has no target');}
			if (typeof(event.target.tagName) === 'undefined') { return;}
			if (this.ShouldIgnore()) { return;}
			this.DOMExtractAndScan(event);
		}
	
		HandleDOM(event) {
			if (typeof(event) === 'undefined') { throw new Error('event required');}
			if (supportedDOMEvents.indexOf(event.type) === -1) {
				throw new Error('unsupported event type - ', event.type);
			}
			if (typeof(this['HandleDOM_' + event.type]) === 'function') {
				this['HandleDOM_' + event.type](event);
			}
		};
	
		BindToDOM() {
			document.addEventListener('change', this.HandleDOM.bind(this));
			document.addEventListener('keyup', this.HandleDOM.bind(this));
			setInterval(() => {
				this.DOMExtractAndScan(new Event('scan'));
			}, 1000);
		}
	
		Initialize(terms, ignoredSites, mode) {
			if (!Array.isArray(terms)) { throw new Error('terms required');}
			if (!Array.isArray(ignoredSites)) { throw new Error('ignoredSites required');}
			return new Promise((resolve, reject) => {
				this.terms = [];
				terms.forEach((term) => {
					const args = {term: term};
					let regexTerm = term.replace(/[\]{}?^$().*\\+|[]/g, '\\$&');
					regexTerm = regexTerm.replace(/\\\*/g, '.*');
					regexTerm = regexTerm.replace(/\\\?/g, '.');
					args.regex = new RegExp('\\b' + regexTerm + '\\b','gi');
					this.terms.push(args);
				});
				this.ignoredSites = ignoredSites;
				this.initialized = true;
				if (mode === 'intent') {
					console.debug('[LS Filter] user intent');
					this.BindToDOM();
				}
				resolve();
			});
		}
	
		SiteMatchers() {
			if (typeof(this.siteMatchers) !== 'undefined') { return this.siteMatchers;}
			if (!Boolean(this.initialized)) { throw new Error('Initialization required');}
			try {
				this.siteMatchers = [];
				this.ignoredSites.forEach((site) => {
					if (typeof(site) === 'object') {
						if (Boolean(site.r)) {
							this.siteMatchers.push(
								new RegExp(site.url, 'i')
							);
						}
					} else if (typeof(site) === 'string') {
						if (site.match(/^([\w\d-]{1,63}\.)+[\w\d-]{1,63}$/i)) {
							this.siteMatchers.push(site.toLowerCase().split('.'));
						} else {
							let escapedUrl = site.replace(/[\]{}?^$().*\\+|[]/g, '\\$&');
							escapedUrl = escapedUrl.replace(/\\\*/g, '.*');
							this.siteMatchers.push(new RegExp('^' + escapedUrl + '$', 'i'));
						}
					}
				});
			} catch (e) {
				this.siteMatchers = undefined;
				throw e;
			}
			return this.siteMatchers;
		}
	
		ShouldIgnore() {
			if (!Boolean(this.initialized)) { throw new Error('Initialization required');}
			let ignore = false;
			const parts = this.UrlObject.hostname.toLowerCase().split('.');
			this.SiteMatchers().some((site) => {
				if (Object.prototype.toString.call(site) === '[object Array]') {
					const al = site.length;
					const pl = site.length;
					if (al <= pl) {
						for (let i=0; i<al; i++) {
							if (site[(al-1)-i] !== parts[(pl-1)-i]) {
								return false;
							}
						}
						ignore = true;
						return true;
					}
				} else if (this.UrlObject.href.match(site)) {
					ignore = true;
					return true;
				}
			});
			return ignore;
		}
	
		Scan(input) {
			const flags = [];
			let currentText = '';
			let customInput = false;
			if (!Boolean(this.initialized)) { throw new Error('Initialization required');}
			if (typeof(input) !== 'undefined' && typeof(input) !== 'string') { throw new Error('string required');}
			if (this.ShouldIgnore()) { return flags;}
			if (typeof(this.reportedTerms[this.UrlObject.href]) === 'undefined') {
				this.reportedTerms[this.UrlObject.href] = {};
			}
			if (typeof(input) === 'undefined') {
				currentText = document.body.innerText;
				// Already scanned this.
				if (currentText === this.lastBodyText) {
					return;
				}
			} else {
				currentText = input;
				customInput = true;
			}
	
			this.terms.forEach((args) => {
				const hits = currentText.match(args.regex);
				if (hits !== null && typeof(hits) !== 'undefined' && hits.length > 0) {
					if (typeof(this.reportedTerms[this.UrlObject.href][args.term]) === 'undefined') {
						flags.push([args.term, hits.length]);
						this.reportedTerms[this.UrlObject.href][args.term] = hits.length;
					} else if (customInput) {
						flags.push([args.term, hits.length]);
					}
				}
			});
			return flags;
		}
	
		Report(flags) {
			if (window.relay_log === 'debug') { console.debug('[LS Filter] flag report'); }
			if (!Array.isArray(flags)) { throw new Error('flags must be an array');}
			if (flags.length === 0) { return;}
			const xhr = new XMLHttpRequest();
			xhr.open('POST', document.location.origin + '/772ff609488b2c9bb6bb2871cac430715c14f39e1462bea30062462d694cfd9a/log_flag', true);
			if (window.relay_log === 'debug') { console.debug('[LS Filter] sending -> ', flags); }
			xhr.send(JSON.stringify({
				url: this.UrlObject.href,
				flags: flags,
				at_epoch_ms: Date.now()
			}));
		}
	};
	module.exports = Flags;
	
	},{"./facebook_flags":2,"./gmail_flags":3,"./google_doc_flags":4,"./ms_office_flags":6,"./twitter_flags":7}],6:[function(require,module,exports){
	class MSOffice {
		constructor(urlObject) {
			if (typeof(urlObject) === 'undefined') { throw new Error('URL OBject required');}
			this.disabled = true;
			this.moduleName = 'ms_office';
			this.hostname = urlObject.hostname.toLowerCase();
			this.disabled = this.setDisabled();
		}
	
		GatherIntent() {
			if (this.disabled) { return;}
			const ret = [document.body.innerText];
			return ret;
		}
	
		setDisabled() {
			const hostParts = this.hostname.split('.');
			const len = hostParts.length;
			if (!hostParts[len - 2]) { return true;}
			let domainName = hostParts[len - 2];
			let subDomainName = hostParts[len - 3];
			if (domainName === 'co' && hostParts[len - 1] === 'uk') {
				domainName = hostParts[len - 3];
				subDomainName = hostParts[len-4];
			}
	
			switch (domainName) {
				case 'live':
				case 'office':
				case 'office365':
					break;
				default:
					return true;
			}
			switch (subDomainName) {
				case 'officeapps':
				case 'outlook':
					return false;
				default:
					return true;
			}
		}
	}
	
	module.exports = MSOffice;
	
	},{}],7:[function(require,module,exports){
	class Twitter {
		constructor(urlObject) {
			if (typeof(urlObject) === 'undefined') { throw new Error('URL OBject required');}
			this.disabled = true;
			this.moduleName = 'twitter';
			if (urlObject.hostname.match(/\.?twitter\.com$/i)) {
				this.disabled = false;
			}
		}
	
		GatherIntent() {
			if (this.disabled) { return;}
			const ret = [];
			const elements = document.querySelectorAll('.tweet-box.rich-editor');
			elements.forEach((e) => {
				ret.push(e.innerText);
			});
			return ret;
		}
	}
	
	module.exports = Twitter;
	
	},{}]},{},[1]);	
