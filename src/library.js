import React, { Component } from 'react';
import * as ReactDOM from 'react-dom';
import './library.css';

const ENTER_KEYCODE = 13
let itemsContainer = '';
let scrollableContainer = '';

class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      topics: [],
      query: '',
      error: '',
      loading: false,
      color: '4262ff'
    }
    this.containerRef = React.createRef();
    this.itemsContainer = document.querySelector('.items_container');

  }
  
  componentDidMount() {
    const searchInputElement = document.querySelector('.miro-input');
    // searchInputElement.addEventListener('keydown', function (e) {
    //   if (e.keyCode === ENTER_KEYCODE) {
    //     search();
    //   }
    // });
    scrollableContainer = document.querySelector('.scrollable-container');
    scrollableContainer.addEventListener('scroll', this.scrollHandler);

    this.bootstrap();
  }
  
  search() {
    this.setState({topics: [], error: ''});
    this.loadTopics();
  }
  
  showLoader() {
    this.setState({ loading: true});
    document.querySelector('.rtb-material-spinner').style.display = 'block';
  }
  
  hideLoader() {
    this.setState({ loading: false});
    document.querySelector('.rtb-material-spinner').style.display = 'none';
  }
  
  createShape(canvasX, canvasY, text) {
    return miro.board.widgets.create({
      type: 'shape',
      text: text,
      x: canvasX,
      y: canvasY,
      height:50,
      width:200,
      style: {
        paddingTop:'10px',
        textColor: '#fff',
        backgroundColor: '#' + this.state.color,
        borderColor: 'transparent',
      },
    });
  }
  
  bootstrap() {
    this.hideLoader();
    let currentShapeText = '';
    const shapeOptions = {
      draggableItemSelector: '.topic',
      onClick: async (targetElement) => {
        const text = targetElement.innerText
        const widget = (await this.createShape(0, 0, text))[0]
        miro.board.viewport.zoomToObject(widget)
      },
      getDraggableItemPreview: (targetElement) => {
        currentShapeText = targetElement.innerText
        return {
          url: `data:image/svg+xml,<svg width="200" height="50" xmlns="http://www.w3.org/2000/svg">
          <g>
          <text xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" id="svg_1" y="307.5" x="464.5" stroke-width="0" stroke="#000" fill="#000000">test</text>
          <rect id="svg_1" height="50" width="200" y="0" x="-0.5" stroke-opacity="null" stroke-width="0" stroke="#000" fill="#${this.state.color}"/>
          </g>
         </svg>`,
        }
      },
      onDrop: (canvasX, canvasY) => {
        this.createShape(canvasX, canvasY, currentShapeText);
      },
    }
    miro.board.ui.initDraggableItemsContainer(this.containerRef.current, shapeOptions);
  }
  
  showNotFoundMessage(query) {
    this.setState({error: 'Topics for "' + query + '" not found'});
  }
  
  showErrorMessage() {
    this.setState({error: 'Something went wrong'});
  }
  
  scrollHandler() {
    const { loading } = this.state;
    const maxScroll = scrollableContainer.scrollHeight - scrollableContainer.offsetHeight;
    const currentScroll = scrollableContainer.scrollTop;
  
    if (maxScroll - currentScroll < PAGINATION_SCROLL_DELTA) {
      if (!loading && hasMoreItems) {
        this.loadTopics();
      }
    }
  }
  
  loadTopics() {
    let { query } = this.state;
    let topics = [];
    console.log(topics);
    this.showLoader();
    fetch('https://81c7611f4674.ngrok.io/query.json')
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 404) {
            this.showNotFoundMessage(query);
            throw new Error('not found')
        } else {
          this.showErrorMessage();
          throw new Error('error')
        }
      })
      .then((data) => {
        let searchRegex = new RegExp(query, 'gi');
        data.forEach(({ name, id }, i) => {
          if(searchRegex.test(name)) {
            topics.push({ name, id });
          }
        });
        return topics;
      })
      .finally(() => {
        this.hideLoader();
        if(topics.length > 0) {
          this.setState({topics});
        } else{
          this.showNotFoundMessage(query)
        }
      })
  }


  renderError() {
    const {error} = this.state.error;
    if(error) {
      return (<h3>${error}</h3>);
    }
  }

  renderShapes() {
    return this.state.topics.map(({id, name}, i) => {
      return <div className="topic draggable-item" key={`${id}_i`} data-id={id}>{name}</div>
    });
  }

  render() {
    return (
      <div>
        <div className="searchbar">
          <div className="miro-input-group miro-input-group--small">
            <input type="text" 
            className="miro-input miro-input--primary" 
            name="search" 
            placeholder="Search Topics" 
            onChange={(e) => this.setState({ query: e.target.value})}/>
            <button type="submit" className="miro-btn miro-btn--primary" onClick={() => this.search()}>
              <svg 
              className="search-icon" 
              version="1.1" 
              xmlns="http://www.w3.org/2000/svg" 
              x="0px" 
              y="0px" 
              width="48px"
              height="48px" 
              viewBox="0 0 24 24" >
                <g id="Icons" style={{opacity:0.75}}>
                  <path id="search" d="M16.021,15.96l-2.374-2.375c-0.048-0.047-0.105-0.079-0.169-0.099c0.403-0.566,0.643-1.26,0.643-2.009
                    C14.12,9.557,12.563,8,10.644,8c-1.921,0-3.478,1.557-3.478,3.478c0,1.92,1.557,3.477,3.478,3.477c0.749,0,1.442-0.239,2.01-0.643
                    c0.019,0.063,0.051,0.121,0.098,0.169l2.375,2.374c0.19,0.189,0.543,0.143,0.79-0.104S16.21,16.15,16.021,15.96z M10.644,13.69
                    c-1.221,0-2.213-0.991-2.213-2.213c0-1.221,0.992-2.213,2.213-2.213c1.222,0,2.213,0.992,2.213,2.213
                    C12.856,12.699,11.865,13.69,10.644,13.69z"/>
                </g>
              <g id="Guides">
              </g>
              </svg>
            </button>
          </div>
        </div>

        <div className="scrollable-container">
          <div className="items_container"ref={this.containerRef}>
            {this.renderError()}
            {this.renderShapes()}
          </div>
          <div className="rtb-material-spinner">
            <svg className="rtb-material-spinner-circular" viewBox="25 25 50 50" style={{ width: '50px'}}>
              <circle
                className="rtb-material-spinner-path"
                cx="50"
                cy="50"
                r="20"
                fill="none"
                strokeWidth="2"
                strokeMiterlimit="10"
              ></circle>
            </svg>
          </div>
        </div>

      </div>
    );
  }
}

miro.onReady(function () {
  ReactDOM.render(<Root />, document.getElementById('root'));
});