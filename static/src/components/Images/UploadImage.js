import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/uploadImage';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        image: state.uploadImage.image,
        isUploading: state.uploadImage.isUploading,
        uploadResultMessage: state.uploadImage.uploadResultMessage
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class UploadImage extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          file: null,
          disabled: true,
          categories: '',
          isPublic: 0
      };
  }

  handleFileChange(e, type) {
      if (e.target.files.length) {
        this.setState({
          file: e.target.files[0],
          disabled: false
        })
      }
  }

  changeTextValue(e, type) {
      this.setState({
        [type]: e.target.value
      })
  }

  changeCheckboxValue(e, type) {
      this.setState({
        [type]: e.target.checked ? 1 : 0
      })
  }

  handleUpload(e) {
      e.preventDefault();
      const token = this.props.token;
      this.props.uploadImage(token, this.state.file, this.state.isPublic, this.state.categories);
      this.setState({
        file: null,
        disabled: true
      })
  }

    render() {
        return (
          <div>
          <input
            accept="image/*"
            id="contained-button-file"
            multiple
            type="file"
            onChange={(e) => this.handleFileChange(e)}
          />
          <div className="col-md-12">
          <TextField
            hintText="Categories (comma-delimited)"
            floatingLabelText="Categories (comma-delimited)"
            type="text"
            onChange={(e) => this.changeTextValue(e, 'categories')}
          />
          </div>

          <div className="col-md-12">
          <Checkbox
            label="Public (let others see this image)"
            onCheck={(e) => this.changeCheckboxValue(e, 'isPublic')}
          />
          </div>

          <RaisedButton
           color="primary"
           onClick={(e) => this.handleUpload(e)}
           disabled={this.state.disabled}
          >
            Upload Image
          </RaisedButton>

          <h2>{this.props.uploadResultMessage}</h2>
          </div>
        );
    }
}

UploadImage.propTypes = {
    isUploading: React.PropTypes.bool,
    image: React.PropTypes.any,
    token: React.PropTypes.string,
};
