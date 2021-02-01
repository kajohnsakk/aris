import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import i18n from '../components/i18n';
import LanguageIcon from '@material-ui/icons/Language';
import { withTranslation, Trans } from 'react-i18next';
import Tutorial from './Tutorial';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';


class LanguageMenu extends Component {
    state = {
        anchorEl: null,
        changed: false,
        dropMenu: false,
        tutorial: false,
        tutorialNumber: "",
    };

    handleClick = event => {
        this.setState({
            anchorEl: event.currentTarget,
            changed: true
        });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleChangeLanguage = (newLanguage) => {
        i18n.changeLanguage(newLanguage)
            .then(() => {
                localStorage.setItem('i18nextLng', newLanguage);

                this.setState({ anchorEl: null, changed: true, currentLanguage: newLanguage.toUpperCase() });
                this.forceUpdate();
                // window.location.reload();
            });
    }

    checkLanguage = (language) => {
        for (let i = 0; i < i18n.languages.length; i++) {
            if (language === i18n.languages[i]) {
                this.handleChangeLanguage(language)
            }
        }
        this.setState({ dropMenu: !this.state.dropMenu });
    }

    componentDidMount() {
        this.checkCurrentLanguage();
    }

    checkCurrentLanguage = () => {
        let currentLanguage = localStorage.getItem('i18nextLng');
        this.setState({
            currentLanguage: currentLanguage.toUpperCase()
        });
    }

    toggleMenu = () => {
        this.setState({ dropMenu: !this.state.dropMenu });
    }

    toggleTutorial = (number) => {
        this.setState({ 
            tutorial: !this.state.tutorial,
            tutorialNumber: number,
        });
    }

    render() {
        const { currentLanguage } = this.state;
        return (

            <div class="md:inline-flex flex-col md:fixed md:w-48"  style={{ "background": "#EB3390" }}>
                <button onClick={this.toggleMenu} class="flex items-center px-3 py-2 text-white border rounded border-teal-400 hover:text-white hover:border-white">
                    <LibraryBooksIcon /><Trans i18nKey="navigation.tutorial" />
                </button>

                <div className={`${this.state.dropMenu ? `block` : `hidden`} items-center md:h-48`}>
                    <div class="">
                        <div className = "pt-4 pl-6 text-white hover:text-white">
                            <a href="#tutorial" onClick={() => this.toggleTutorial("1")} className="text-white hover:text-white">
                                <Trans i18nKey="navigation.register" />
                            </a>
                        </div>
                        <div className="pt-4 pl-6 text-white hover:text-white">
                            <a href="#tutorial" onClick={() => this.toggleTutorial("2")} className="text-white hover:text-white"> 
                                <Trans i18nKey="navigation.chatbot" />
                            </a>
                        </div>
                        <div className = "pt-4 pl-6 text-white hover:text-white">
                            <a href="#tutorial" onClick={() => this.toggleTutorial("3")} className="text-white hover:text-white">
                                <Trans i18nKey="navigation.live" />
                            </a>
                        </div>
                        <div className="pt-4 pl-6 text-white hover:text-white">
                            <a href="#tutorial" onClick={() => this.toggleTutorial("4")} className="text-white hover:text-white"> 
                                <Trans i18nKey="navigation.payment" />
                            </a>
                        </div>
                    </div>
                </div>

                <Tutorial show={this.state.tutorial}
                onClose={this.toggleTutorial}
                tutorialNumber={this.state.tutorialNumber}>
                </Tutorial>
            </div>
            
        );
    }
}


export default (LanguageMenu);
