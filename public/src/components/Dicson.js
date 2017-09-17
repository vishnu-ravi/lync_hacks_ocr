import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import curryRight from 'lodash.curryright';
import $ from "jquery";
import slugify from 'slugify';
import { browserHistory } from 'react-router';
import * as actions from '../actions';
import PropTypes from 'prop-types';

require('../../assets/style/main.less')

import d3 from 'd3';
import Header from './Header';

import {
    defineMessages,
    FormattedMessage,
    FormattedDate,
    injectIntl,
    intlShape
} from 'react-intl';
const labels = defineMessages({
    title: {
        id: 'home_title',
        defaultMessage: '<small>Optical Character Recognition</strong>'
    },
    sub_title: {
        id: 'home_sub_title',
        defaultMessage: 'Optical Character Recognition'
    }
});

class Dicson extends Component {
    constructor() {
        super();
        this.state = {
            welcomeText: '',
            pageProgress: ''
        };
    }

    componentDidMount() {
        console.log('dicson');
        setTimeout(function(){
           $('#appLoader').hide();
           $('html').removeClass('oh');
        }, 3000);
    }

    render() {
        const width = window.innerWidth; // canvas width
        const height = window.innerHeight; // canvas height
        const { formatMessage } = this.props.intl;

        return (
            
            <div className={`page homePage ${this.state.pageProgress}`}>
                <div className="section section1">
                    <div className="box">
                        <div className="prograss"><i></i></div>
                        <div className="fileUpload">
                            <h3>Optical Character <br/>Recognition</h3>
                            <a className="uploadBtn loaded">
                                <span><strong>CLICK</strong><span>HERE</span></span>
                                <em><small></small></em>
                            </a>
                            <p>To listed all Aadhar details</p>
                        </div>
                    </div>
                </div>
                <div className="section section2">
                    <div className="ocrWrp">
                        <ul>
                            <li className="male">
                                <h3><span>Dicson Deepak</span><i></i></h3>
                                <div className="details">
                                    <div className="dob"><strong>DOB: </strong><span>25-10-1989</span></div>
                                    <div className="sex"><strong>SEX: </strong><span>Male</span></div>
                                    <div className="name"><strong>Aadhar No: </strong><span>9874 1245 4578</span></div>
                                    <div className="dob"><strong>Fathers or <br/>Husbands Name: </strong><span>Suresh D</span></div>
                                    <div className="sex"><strong>State: </strong><span>TamilNadu</span></div>
                                    <div className="sex"><strong>Pincode: </strong><span>600044</span></div>
                                    <div className="address"><strong>Address: </strong>
                                        <span>The button size can be easily adjusted by changing the padding and</span>
                                    </div>
                                </div>
                            </li>
                            <li className="female">
                                <h3><span>Dicson Deepak</span><i></i></h3>
                                <div className="details">
                                    <div className="dob"><strong>DOB: </strong><span>25-10-1989</span></div>
                                    <div className="sex"><strong>SEX: </strong><span>Male</span></div>
                                    <div className="name"><strong>Aadhar No: </strong><span>9874 1245 4578</span></div>
                                    <div className="dob"><strong>Fathers or <br/>Husbands Name: </strong><span>Suresh D</span></div>
                                    <div className="sex"><strong>State: </strong><span>TamilNadu</span></div>
                                    <div className="sex"><strong>Pincode: </strong><span>600044</span></div>
                                    <div className="address"><strong>Address: </strong>
                                        <span>The button size can.</span>
                                    </div>
                                </div>
                            </li>
                            <li className="male">
                                <h3><span>Dicson Deepak</span><i></i></h3>
                                <div className="details">
                                    <div className="dob"><strong>DOB: </strong><span>25-10-1989</span></div>
                                    <div className="sex"><strong>SEX: </strong><span>Male</span></div>
                                    <div className="name"><strong>Aadhar No: </strong><span>9874 1245 4578</span></div>
                                    <div className="dob"><strong>Fathers or <br/>Husbands Name: </strong><span>Suresh D</span></div>
                                    <div className="sex"><strong>State: </strong><span>TamilNadu</span></div>
                                    <div className="sex"><strong>Pincode: </strong><span>600044</span></div>
                                    <div className="address"><strong>Address: </strong>
                                        <span>The button size can be easily adjusted by changing the padding and</span>
                                    </div>
                                </div>
                            </li>
                            <li className="female">
                                <h3><span>Dicson Deepak</span><i></i></h3>
                                <div className="details">
                                    <div className="dob"><strong>DOB: </strong><span>25-10-1989</span></div>
                                    <div className="sex"><strong>SEX: </strong><span>Male</span></div>
                                    <div className="name"><strong>Aadhar No: </strong><span>9874 1245 4578</span></div>
                                    <div className="dob"><strong>Fathers or <br/>Husbands Name: </strong><span>Suresh D</span></div>
                                    <div className="sex"><strong>State: </strong><span>TamilNadu</span></div>
                                    <div className="sex"><strong>Pincode: </strong><span>600044</span></div>
                                    <div className="address"><strong>Address: </strong>
                                        <span>The button size can be easily adjusted by changing the padding and</span>
                                    </div>
                                </div>
                            </li>
                            <li className="loader2">
                                <div className="ocrloader">
                                    <em></em>
                                    <div>
                                        <i></i><i></i><i></i><i></i><i></i><i></i><i></i>
                                        <i></i><i></i><i></i><i></i><i></i><i></i><i></i>
                                        <i></i><i></i><i></i>
                                    </div>
                                    <span></span>
                                </div>
                            </li>
                        </ul>
                        <div className="action">
                            <div className="btn">Back</div>    
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Dicson.PropTypes = {
    intl: intlShape.isRequired
};
const injectIntlDecorator = curryRight(injectIntl);

function mapStateToProps(state, ownProps) {
    return {
    }
}
//This all fuzzz is because we need injecting react-intl
export default compose(injectIntlDecorator(),
    connect(mapStateToProps, actions, null, { pure: false })
)(Dicson);
