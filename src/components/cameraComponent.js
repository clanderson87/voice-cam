import React from 'react';
import jsQR from 'jsqr';
import ControlsComponent from './controlsComponent';

/* PROPS PACKAGE:
  -onPicSelected: function({file.jpg, url}) fires upon successful photo selected
  -onClose: function()                      fires upon camera close with no photo selected
  -onScan: function(code: string)           fires upon successful scanning of a QR code
  -qr: bool                                 if camera is in QR code scanning mode (default is false)
  -timedCapture: bool                       if camera is on countdown mode (ex: 3, 2, 1, cheese!)
  -timedCaptureDelay: num                   delay in seconds before the capture fires (default is 3 seconds)
  -noRetakes: bool                          if users are allowed to retake photos (default is false - users are allowed to retake photos)
*/


class CameraComponent extends React.Component {
  constructor(props){
    super();
    this.state = {}
    this.camRef = React.createRef();
  }

  componentDidMount = () => {
    this.startCamera()
    if(this.props.timedCapture){
      this.initializeTimedCapture();
    }
  }

  initializeTimedCapture = () => {
    this.interval = setInterval(() => this.timedCaptureLoop(this.props.timedCaptureDelay), 1000)
  }

  timedCaptureLoop = (delay = 3) => {
    let { time } = this.state;
    time = time ? time - 1 : delay - 1;
    this.setState({ time });
    time === 0 ? (clearInterval(this.interval), this.recordData()): null;
  }

  setDataURL = url => {
    let byteString = atob(url.split(",")[1]);
    let mimeString = url
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    };
    const file = new File([ab], 'picture.jpg', {
      type: mimeString
    });
    const fileUrl = URL.createObjectURL(file);
    this.setState({ file, url: fileUrl });
  }

  closeCamera = () => {
    const player = this.refs.player;
    player.srcObject.getVideoTracks().forEach(track => track.stop());
    this.props.onClose()
    //fscreen.exitFullscreen();
  };

  startCamera = () => {
    setTimeout(() => {
      const player = this.refs.player;
      const camera = this.refs.camera;
      //fscreen.requestFullscreen(camera);
      const constraints = { video: { width: this.sw, height: this.sh }};
      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        player.srcObject = stream;
      });
    }, 10);
  };

  recordData = () => {
    const canvas = this.refs.canvas;
    const player = this.refs.player;
    const w = canvas.width;
    const h = canvas.height;
    const ctx = canvas.getContext("2d");
    let fails = 0;

    const finish = (error = null) => {
      error ? this.setState({ error }) : null;
      this.closeCamera();
    }

    const captureImage = (qr = false) => {
      if (fails > 30) {
        finish('No QR code detected!');
        return;
      }
      ctx.drawImage(player, 0, 0, w, h);

      if (qr) {
        const { data } = ctx.getImageData(0, 0, w, h);
        const code = jsQR(data, w, h);
        if (code) {
          this.props.onScan(code.data);
          finish();
        } else {
          fails++;
          captureImage(this.props.qr);
        }
      } else {
        const dataUrl = canvas.toDataURL("image/jpeg");
        finish();
        this.setDataURL(dataUrl);
      }
    }
    captureImage(this.props.qr);
  }

  render(){
    return <div>
      {this.state.file ?
        <div>
          <img src = {this.state.url} />
          { this.props.noRetakes ? null : <ControlsComponent buttonGroup ={[
            {text: <i className = "material-icons">arrow_back</i>, onClick: () => {this.setState({ file: null, url: null, time: null }), this.componentDidMount()}},
          {text: <i className = "material-icons">check</i>, onClick: () => this.props.onPhotoTaken({file: this.state.file, url: this.state.url})}
          ]} />}
        </div>
        :
      <div>
        <video ref = 'player' autoPlay width = 'auto' />
        <canvas ref = 'canvas' hidden = {true} className = 'pictureCanvas' width = {640} height = {480} />
        { this.props.timedCapture ? this.state.time :
        <ControlsComponent buttonGroup = {[
          {text: <i className = "material-icons">arrow_back</i>, onClick: () => this.closeCamera()},
          {text: <i className = "material-icons">camera</i>, onClick: () => this.recordData()}]}/>
        }
      </div>
    }
    </div>
  }
}

const styles = {};

export default CameraComponent;
