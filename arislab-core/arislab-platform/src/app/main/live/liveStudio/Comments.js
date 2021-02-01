import React, { Component } from 'react';
// import ReactEventSource from 'react-eventsource';
import { Avatar } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { Trans, withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import _ from '@lodash';
import axios from 'axios';

const styles = theme => ({
    profileImage: {
        width: '50px',
        height: '50px'
    }
});

class Comments extends Component {

    state = {
        storeInfo: {},
        eventInfo: {},
        commentURL: '',
        commentList: [],
        messageRate: 100
    }
    eventSource = undefined;

    componentDidMount() {

        if( typeof this.props.storeInfo !== 'undefined' && typeof this.props.eventInfo !== 'undefined' ) {
            this.setState({ storeInfo: this.props.storeInfo, eventInfo: this.props.eventInfo });
        }
        this.startUpdateCommentUrl()
        // if( (this.props.videoID || typeof this.props.videoID !== 'undefined') && (this.props.accessToken || typeof this.props.accessToken !== 'undefined') ) {
        //     this.GetCommentUrl();
        // }
        
    }

    componentDidUpdate(prevProps, prevState) {

        if( typeof this.props.storeInfo !== 'undefined' && !_.isEqual(this.props.storeInfo, prevProps.storeInfo) ) {
            this.setState({ storeInfo: this.props.storeInfo });
        }

        if( !_.isEqual(this.props.storeInfo, prevProps.storeInfo) ) {
            this.setState({ storeInfo: this.props.storeInfo });
        }

        if( !_.isEqual(this.props.eventInfo, prevProps.eventInfo) ) {
            this.setState({ eventInfo: this.props.eventInfo });
        }

        // if( !_.isEqual(this.props.accessToken, prevProps.accessToken) ) {
        //     this.startUpdateCommentUrl();
        // }

    }

    componentWillUnmount() {

        if( this.eventSource ) {
            this.eventSource.close();
            this.eventSource = undefined;
        }
        
    }

    startUpdateCommentUrl() {
        setInterval(() => {
            if(this.state.messageRate === 100)
                this.getCommentUrl()
            else
                this.updateCommentUrl()
        }, 1000);
    }

    checkDuplicateComment(list,data) {
        for(let i=0; i < list.length; i++){
            if(list[i].id === data.id)
                return true
        }
        return false
    }

    getCommentUrl = () => {
        if( this.props.videoID.length > 0 && this.props.accessToken.length > 0) {
            const apiUrl = `https://graph.facebook.com/${this.props.videoID}/comments?access_token=${this.props.accessToken}&limit=${this.state.messageRate}&order=reverse_chronological`
            axios.get(apiUrl).then((response) => {
                if (response && !response.error) {
                    this.setState({ commentList : response.data.data })
                    this.setState({ messageRate : 10 })
                }
            }).catch((error) => {
                // console.log(error)
            })
        }
    }

    updateCommentUrl = () => {
        if( this.props.videoID.length > 0 && this.props.accessToken.length > 0 ) {
            // const sourceUrl = `https://streaming-graph.facebook.com/${this.props.videoID}/live_comments?access_token=${this.props.accessToken}&comment_rate=one_hundred_per_second&fields=from{name,id},message`;
            // this.setState({ commentURL: sourceUrl });
            const apiUrl = `https://graph.facebook.com/${this.props.videoID}/comments?access_token=${this.props.accessToken}&limit=${this.state.messageRate}&order=reverse_chronological`
            axios.get(apiUrl).then((response) => {
                if (response && !response.error) {
                    let commentList = this.state.commentList
                    let resList = response.data.data
                    for(let i=resList.length-1; i >= 0; i--)
                        if(!this.checkDuplicateComment(commentList,resList[i]))
                            commentList.unshift(resList[i])
                    this.setState({ commentList: commentList });
                }
            }).catch((error) => {
                // console.log(error)
            });
            // if( typeof eventSource === "undefined" ) {
            //     this.eventSource = new EventSource(`https://streaming-graph.facebook.com/${this.props.videoID}/live_comments?access_token=${this.props.accessToken}&comment_rate=one_hundred_per_second&fields=from{name,id},message`);
            //     this.eventSource.onmessage = e => {
            //         // console.log("Comment ============> ", JSON.parse(e.data));
            //         var commentList = this.state.commentList;
            //         commentList.unshift( e.data );
            //         console.log(e.data)
            //         this.setState({ commentList: commentList });
            //     }
            // }
        
        }
    };



    render(){
        const { classes } = this.props;
        const { storeInfo, eventInfo, commentList } = this.state;

        const renderEvent = (event) => {

            return (
                
                <div className="bg-gray-300 py-12 flex w-full break-words text-xs" key={event.id}>
                    <div className="font-bold mr-8">{ event.from.name }</div>
                    <div className="flex-1 w-full items-stretch" style={{ wordBreak: "break-all" }}>{ event.message }</div>
                </div>
                // <div className="bg-gray-100 py-8 flex" key={JSON.parse(event)['id']}>
                //     <div className="text-bold mr-4">{ JSON.parse(event)['from']['name'] }</div>
                //     <div className="">{ JSON.parse(event)['message'] }</div>
                // </div>
            );
        }
        return(

            <React.Fragment>
                { storeInfo.hasOwnProperty('businessProfile') ? (
                    <div className="flex flex-col border-solid border-b p-8">
                        <div className="flex flex-row items-center mb-12">
                            <div className="mr-12">
                                { storeInfo.businessProfile.logo.length > 0 ? <Avatar className={classes.profileImage} alt={storeInfo.businessProfile.accountDetails.name} src={storeInfo.businessProfile.logo} /> : <Avatar className={classes.profileImage} alt={storeInfo.businessProfile.accountDetails.name}><PersonIcon /></Avatar> }
                            </div>
                            <div><span className="text-black font-extrabold">{storeInfo.businessProfile.accountDetails.name}</span> <span className="text-gray-600"><Trans i18nKey="live-event.is-live-now">is live now.</Trans></span></div>
                        </div>
                        <div className="flex text-xs overflow-y-auto" style={{ height: '80px', wordBreak: 'break-all' }}>{ eventInfo.hasOwnProperty('description') ? eventInfo.description : null }</div>
                    </div>
                ) : (null) }
                <div className="w-full">
                    {/* { commentURL.length > 0 ? (
                        
                        <ReactEventSource url={commentURL} >
                            { events => events.length > 0 ? (
                                <div className="h-full p-8 overflow-y-auto" style={{ backgroundColor: "#f7fafc", maxHeight: "550px" }}>
                                    {events.map(renderEvent).reverse()}
                                </div>
                            ) : (
                                <div className="h-full p-16 flex justify-center"><Trans i18nKey="live-event.no-comment">No comment...</Trans></div>
                            ) }
                        </ReactEventSource>
                        
                    ) : (
                        <div className="h-full p-16 flex justify-center"><Trans i18nKey="live-event.no-comment">No comment...</Trans></div>
                    ) } */}

                    { commentList !== undefined && commentList.length > 0 ? (
                        <div className="h-full p-8 overflow-y-auto" style={{ backgroundColor: "#f7fafc", maxHeight: "550px" }}>
                            {commentList.map(renderEvent)}
                        </div>
                    ) : (
                        <div className="h-full p-16 flex justify-center"><Trans i18nKey="live-event.no-comment">No comment...</Trans></div>
                    ) }
                </div>
            </React.Fragment>

        )
    }
}

export default (withStyles(styles, { withTheme: true }))(withTranslation()(Comments));