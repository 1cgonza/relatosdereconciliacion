import React, { Component } from 'react';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default';

export default class Docs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false
    };
  }

  closest(el, fn) {
    return el && (fn(el) ? el : this.closest(el.parentNode, fn));
  }

  onImageClick = e => {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);

    let eTarget = e.target || e.srcElement;

    // find root element of slide
    let clickedListItem = this.closest(eTarget, el => {
      return el.tagName && el.tagName.toUpperCase() === 'FIGURE';
    });

    if (!clickedListItem) {
      return;
    }

    // find index of clicked item by looping through all child nodes
    // alternatively, you may define index via data- attribute
    let clickedGallery = clickedListItem.parentNode;
    let childNodes = clickedListItem.parentNode.childNodes;
    let numChildNodes = childNodes.length;
    let nodeIndex = 0;
    let index;

    for (let i = 0; i < numChildNodes; i++) {
      if (childNodes[i].nodeType !== 1) {
        continue;
      }

      if (childNodes[i] === clickedListItem) {
        index = nodeIndex;
        break;
      }
      nodeIndex++;
    }

    if (index >= 0) {
      this.openPhotoSwipe(index, clickedGallery);
    }
    return false;
  };

  parseThumbnailElements(el) {
    let thumbElements = el.childNodes;
    let numNodes = thumbElements.length;
    let items = [];
    let figureEl;
    let linkEl;
    let size;
    let item;

    for (let i = 0; i < numNodes; i++) {
      figureEl = thumbElements[i];

      if (figureEl.nodeType !== 1) {
        continue;
      }

      linkEl = figureEl.children[0]; // <a> element
      size = linkEl.getAttribute('data-size').split('x');

      item = {
        src: linkEl.getAttribute('href'),
        w: parseInt(size[0], 10),
        h: parseInt(size[1], 10)
      };

      if (figureEl.children.length > 1) {
        item.title = figureEl.children[1].innerHTML;
      }

      if (linkEl.children.length > 0) {
        item.msrc = linkEl.children[0].getAttribute('src');
      }

      item.el = figureEl; // save link to element for getThumbBoundsFn
      items.push(item);
    }

    return items;
  }

  openPhotoSwipe(index, galleryElement) {
    let pswpElement = document.querySelector('.pswp');
    let items = this.parseThumbnailElements(galleryElement);

    let options = {
      galleryUID: galleryElement.getAttribute('data-pswp-uid'),
      getThumbBoundsFn: index => {
        let thumbnail = items[index].el.getElementsByTagName('img')[0]; // find thumbnail
        let pageYScroll =
          window.pageYOffset || document.documentElement.scrollTop;
        let rect = thumbnail.getBoundingClientRect();

        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
      }
    };

    options.index = parseInt(index, 10);

    if (isNaN(options.index)) {
      return;
    }

    const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI, items, options);
    gallery.init();
  }

  photoswipeParseHash() {
    let hash = window.location.hash.substring(1);
    let params = {};

    if (hash.length < 5) {
      return params;
    }

    let lets = hash.split('&');
    for (let i = 0; i < lets.length; i++) {
      if (!lets[i]) {
        continue;
      }
      let pair = lets[i].split('=');
      if (pair.length < 2) {
        continue;
      }
      params[pair[0]] = pair[1];
    }

    if (params.gid) {
      params.gid = parseInt(params.gid, 10);
    }

    return params;
  }

  buildFromDom(selector) {
    // loop through all gallery elements and bind events
    let galleryElements = document.querySelectorAll(selector);

    for (let i = 0, l = galleryElements.length; i < l; i++) {
      galleryElements[i].setAttribute('data-pswp-uid', i + 1);
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    let hashData = this.photoswipeParseHash();

    if (hashData.pid && hashData.gid) {
      this.openPhotoSwipe(
        hashData.pid,
        galleryElements[hashData.gid - 1],
        true,
        true
      );
    }
  }

  buildItems(items) {
    if (items) {
      let gall = Object.keys(items);

      return gall.map(imgID => {
        return (
          <figure
            key={imgID}
            className='galleryImg'
            itemProp='associatedMedia'
            itemScope
            itemType='http://schema.org/ImageObject'
          >
            <a
              href={items[imgID].large}
              itemProp='contentUrl'
              data-size={`${items[imgID].w}x${items[imgID].h}`}
              onClick={this.onImageClick}
            >
              <span className='polaroid' />
              <img src={items[imgID].medium} itemProp='thumbnail' alt='' />
              <span className='black' />
            </a>
          </figure>
        );
      });
    }

    return null;
  }

  componentDidMount() {
    this.setState({
      ready: true
    });
  }

  render() {
    if (this.state.ready) {
      this.buildFromDom('.gallery');
    }

    return (
      <div
        ref='gallery'
        className='gallery'
        itemScope
        itemType='http://schema.org/ImageGallery'
      >
        {this.buildItems(this.props.items)}
      </div>
    );
  }
}
