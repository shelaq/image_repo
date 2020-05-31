import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/publicImages';
import Gallery from 'react-grid-gallery';


function mapStateToProps(state) {
    return {
        token: state.auth.token,
        images: state.publicImages.images,
        loaded: state.publicImages.loaded,
        isFetching: state.publicImages.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

function createImageList(imageList) {
  var result = [];
  for (var i = 0; i < imageList.length; i++) {
      if (imageList[i].file_name != null){
        result.push({
          src: "http://127.0.0.1:5000/image_server/" + imageList[i].id,
          thumbnail: "http://127.0.0.1:5000/image_server/" + imageList[i].id,
          thumbnailWidth: 320,
          thumbnailHeight: 174,
        })
      }
  }
  return result;
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PublicImages extends React.Component {
    componentDidMount() {
        this.fetchPublicImages();
    }

    fetchPublicImages() {
      const token = this.props.token;
      this.props.fetchPublicImages(token);
    }

    render() {
        return (
          <div>
            {this.props.loaded ?
              <Gallery images={createImageList(this.props.images)} enableImageSelection={false}/>
              :
              <h1>Loading data...</h1>
            }
          </div>
        );
    }
}

PublicImages.propTypes = {
    fetchPublicImages: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    images: React.PropTypes.any,
    token: React.PropTypes.string,
};
