import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import curryRight from 'lodash.curryright';
import slugify from 'slugify';
import { browserHistory } from 'react-router';
import * as actions from '../actions';
import PropTypes from 'prop-types';
import ReactUploadFile from 'react-upload-file';
import axios from 'axios';
import $ from 'jquery';

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
        defaultMessage: '<small>Title</strong>'
    },
    sub_title: {
        id: 'home_sub_title',
        defaultMessage: 'Hello World'
    }
});

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            welcomeText: '',
            pageProgress: ''
        };
    }

    componentDidMount() {
        setTimeout(function(){
           $('#appLoader').hide();
           $('.section1').show();
           $('html').removeClass('oh');
        }, 3000);
    }

    getApiData() {
        this.props.clearUserDetail();
        this.props.switchLoader();
        axios.get('/get-lynk-addhar-api?t='+new Date().getTime()).then((res) => {
            console.log(res.data);
            if(res.data.success) {
                var body = JSON.parse(res.data.html);
                var length = body.length;
                var loaded = 0;
                this.props.getTotalDetail(body.length);
                for(var i in body) {
                    axios.get('/fetch-aadhar-api?id='+encodeURIComponent(body[i].url)+'&imageuid='+body[i].imageuid+'&page='+i+'&t='+new Date().getTime()).then((res2) => {
                        loaded++;
                        if(res2.data.success) {
                            var ogData = body[res2.data.page];
                            var data = JSON.parse(res2.data.html);
                            var matched = 0;
                            var total = 8;
                            for(let j in data) {
                                if(typeof(data[j]) !== 'undefined' && typeof(ogData[j]) !== 'undefined' &&
                                    data[j].toLowerCase() == ogData[j].toLowerCase())
                                    matched++;

                                console.log(data[j]+'****'+ogData[j]);
                            }
                            data.old = ogData;
                            data.total = total;
                            data.matched = matched;
                            this.props.addUserDetail(data);
                            console.log($('.ocrWrp ul li:last-child').offset());
                            console.log($('.ocrWrp ul li:last-child').offset().bottom);
                            $('html,body').animate({scrollTop: $('.ocrWrp ul li:last-child').offset().top+300}, 'slow');
                            if(length == loaded) {
                                this.props.switchLoader();
                            }
                        }
                    }).catch((err) => {
                        loaded++;
                        if(length == loaded) {
                            this.props.switchLoader();
                        }
                    });
                }
            }
        });
    }

    lower(data) {
        console.log(data);
        return data.toLowerCase();
    }

    percentage(total, match) {
        console.log(total+'******'+match);
        return (parseInt(match)/parseInt(total))*100;
    }

    render() {
        const options = {
            baseUrl: '/file',
            query: {
                warrior: 'fight'
            },
            fileFieldName : 'files',
            didChoose: (files) => {
                console.log('you choose', typeof files == 'string' ? files : files[0].name);
            },
            beforeUpload: (files) => {
                console.log('upload it'); return true;
            },
            didUpload: (files) => {
                console.log('you just uploaded', typeof files === 'string' ? files : files[0].name);
            },
            uploading: (progress) => {
                console.log('loading...', progress.loaded / progress.total + '%');
            },
            uploadSuccess: (resp) => {
                console.log(JSON.parse(resp).success);
                console.log('upload success!');
            },
            dataType : 'JSON',
            uploadError: (err) => {
                console.log(err);
            }
        }
        console.log(options.baseUrl);
        const width = window.innerWidth; // canvas width
        const height = window.innerHeight; // canvas height
        const { formatMessage } = this.props.intl;
        console.log(this.props);
        /*<ReactUploadFile options={options} chooseFileButton={<div className="fileType"><input type="file" id="imageButton"></input></div>} uploadFileButton={<div>Upload a button</div>} />*/
        return (
            <div className={`page homePage ${this.state.pageProgress}`}>

                {(this.props.home.aadhar.length ==  0) ?
                  <div className="section section1">
                    <div className="box">
                        <div className="prograss"><i></i></div>
                        <div className="fileUpload">
                            <h3>Aadhar <span>Optical Character Recognition</span></h3>
                            {(this.props.home.loading) ? <a className="uploadBtn loaded">
                                <span><strong>CLICK</strong><span>HERE</span></span>
                                <em><small></small></em>
                            </a> : <a className="uploadBtn" onClick={this.getApiData.bind(this)}>
                                <span><strong>CLICK</strong><span>HERE</span></span>
                                <em></em>
                            </a>
                            }
                        </div>
                    </div>
                </div>
                : ''}
                {(this.props.home.aadhar.length > 0) ?
                <div className="section section2">
                    <div className="count"><span>{this.props.home.flow}</span><span>{this.props.home.total}</span></div>
                    <div className="ocrWrp">
                        <ul>
                            {this.props.home.aadhar.map((k, v) =>
                                <li className={this.lower(k.sex)} key={v}>
                                            <h3><span>{k.name}</span><i></i></h3>
                                            <div className="details">
                                                <div className="dob"><strong>DOB: </strong><span>{k.dob}</span></div>
                                                <div className="sex"><strong>SEX: </strong><span>{k.sex}</span></div>
                                                <div className="name"><strong>Aadhar No: </strong><span>{k.uid}</span></div>
                                                <div className="dob"><strong>Fathers or <br/>Husbands Name: </strong><span>{k.fathersname}</span></div>
                                                <div className="sex"><strong>State: </strong><span>{k.state}</span></div>
                                                <div className="sex"><strong>Pincode: </strong><span>{k.pincode}</span></div>
                                                <div className="address"><strong>Address: </strong>
                                                    <span>{k.address}</span>
                                                </div>
                                            </div>
                                        </li>

                            )}

                            {(this.props.home.loading) ?
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
                                    : ''}

                        </ul>
                        {(!this.props.home.loading) ?
                        <div className="action" onClick={this.props.clearUserDetail.bind(this)}>
                            <div className="btn">Back</div>
                        </div>
                        : ''}
                    </div>
                </div>
                : ''}




            </div>
        );
    }
}

Home.PropTypes = {
    intl: intlShape.isRequired
};
const injectIntlDecorator = curryRight(injectIntl);

function mapStateToProps(state, ownProps) {
    return {
        home: state
            .getIn(['home'])
            .toJS()
    }
}
//This all fuzzz is because we need injecting react-intl
export default compose(injectIntlDecorator(),
    connect(mapStateToProps, actions, null, { pure: false })
)(Home);
