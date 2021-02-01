import React from 'react';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {WEB_URL} from '../../config/AppConfig';
import flvjs from 'flv.js';

const styles = theme => ({
    videoArea: {
        position: 'relative',
        alignItems: 'center',
        display: 'flex'
    },
    videoMockup: {
        width: '100%',
        height: 'auto',
        maxWidth: 720,
        maxHeight: 1280
    },
    video: {
        width: '100%',
        height: 'auto',
        maxWidth: 720,
        maxHeight: 1280,
        position: 'absolute',
        zIndex: 9998
    },
    overlay: {
        width: '100%',
        height: 'auto',
        maxWidth: 720,
        maxHeight: 1280,
        position: 'absolute',
        zIndex: 9999
    },
});

class LiveVideoFlvPlayer extends React.Component {

    flvPlayer = undefined;
    state = {
        isStreaming: false,
        streamingIpAddress: ''
    };

    // componentDidMount() {

    // }

    componentDidUpdate(prevProps, prevState) {
        if( this.state.isStreaming !== this.props.isStreaming && this.props.streamingIpAddress.length > 0) {
            this.setState({ isStreaming: this.props.isStreaming, streamingIpAddress: this.props.streamingIpAddress });
        }

        if( this.state.streamingIpAddress.length > 0 && this.props.streamingIpAddress !== this.state.streamingIpAddress ) {
            this.setState({ streamingIpAddress: this.props.streamingIpAddress }, () => {
                this.restartStreamVideo();
            });
        }

        if( prevProps.isStreaming && !this.props.isStreaming ) {
            this.stopStreamVideo();
        }
    }

    componentWillUnmount() {
        this.stopStreamVideo();
    }

    restartStreamVideo = () => {
        this.stopStreamVideo();
        this.startStreamVideo(this.state.streamingIpAddress);
    }

    startStreamVideo = (streamingIpAddress) => {
        if( this.props.liveCode !== '' ) {
            if ( flvjs.isSupported() && !this.flvPlayer ) {
                let videoSRC;
                // videoSRC = `http://${streamingIpAddress}/live/${this.props.liveCode}.flv`;
                // videoSRC = `https://3.1.237.31:8443/live/${this.props.liveCode}.flv`;
                videoSRC = `${WEB_URL}live/${this.props.liveCode}.flv?ip=${streamingIpAddress}`;
                var videoElement = document.getElementById('videoElement');
                this.flvPlayer = flvjs.createPlayer({
                    type: "flv",
                    isLive: true,
                    hasAudio: false,
                    cors: true,
                    url: videoSRC
                });
                this.flvPlayer.attachMediaElement(videoElement);
                this.flvPlayer.load();
                this.flvPlayer.play();
            }
        }
    }

    stopStreamVideo = () => {
        try {
            if( this.flvPlayer ) {
                this.flvPlayer.pause();
                this.flvPlayer.unload();
                this.flvPlayer.detachMediaElement();
                this.flvPlayer.destroy();
                this.flvPlayer = undefined;
            }
        } catch (err) {}
    }


    render() {
        const { classes } = this.props;

        if( this.state.isStreaming && this.state.streamingIpAddress.length > 0 ) {
            this.startStreamVideo(this.state.streamingIpAddress);
        }

        return (

            <div className={classnames(classes.videoArea, "flex justify-center items-center")}>
                <img alt="Video Mockup" className={classes.videoMockup} src="assets/images/etc/video-mockup.png" />
                <video ref={ this.video } id="videoElement" className={classes.video}></video>
                { this.props.overlayImage ? (<img alt="Overlay" onLoad={this.props.onImageLoad} className={classes.overlay} src={this.props.overlayImage} />) : null }
            </div>

        );
    }

}

export default withStyles(styles, { withTheme: true })(LiveVideoFlvPlayer);