import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import _ from '@lodash';
import styles from '../styles/styles';
import Classnames from 'classnames';

import { Link } from 'react-router-dom';
import { Trans, withTranslation } from 'react-i18next';

class BreadcrumbCard extends React.Component {

    state = {
        breadcrumbList: []
    };

    componentDidMount() {
        
        if( this.props.breadcrumbList ) {
            this.setState({ breadcrumbList: this.props.breadcrumbList });
        }

    }

    componentDidUpdate(prevProps, prevState) {

        if ( this.state.breadcrumbList.length === 0 && this.props.breadcrumbList ) {
            this.setState({ breadcrumbList: this.props.breadcrumbList });
        }

        if ( !_.isEqual(this.props.breadcrumbList, prevProps.breadcrumbList) ) {
            this.setState({ breadcrumbList: this.props.breadcrumbList });
        }

    }

    render() {
        const { classes } = this.props;
        const { breadcrumbList } = this.state;

        return (
            <Card className={Classnames(classes.card, 'pb-0')}>
                <div className="p-16">
                    { breadcrumbList.length > 0 ? (
                        <div className="flex items-center">
                            {breadcrumbList.map(function(obj, index){
                                if( index === 0 ) {
                                    return (<div key={index}><Link className={classes.highlightText} to={obj.link}><Trans i18nKey={obj.titleI18n}>{obj.title}</Trans></Link></div>);
                                } else {
                                    return (<div key={index} className="flex items-center">
                                        <NavigateNextIcon className="my-0 mx-4 p-0" fontSize="small" />
                                        { obj.link.length > 0 ? (
                                            <Link to={obj.link}><Trans i18nKey={obj.titleI18n}>{obj.title}</Trans></Link>
                                        ) : (
                                            <Trans i18nKey={obj.titleI18n}>{obj.title}</Trans>
                                        ) }
                                    </div>);
                                }
                            })}
                        </div> 
                    ) : (null) }
                </div>
            </Card>
        );
    }
}



export default withStyles(styles)(withTranslation()(BreadcrumbCard));