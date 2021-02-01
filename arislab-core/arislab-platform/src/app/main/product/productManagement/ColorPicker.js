import React from 'react';
import _ from 'lodash';
import * as AppConfig from '../../config/AppConfig'

import 'rc-color-picker/assets/index.css';
import ColorPicker from 'rc-color-picker';
import axios from 'axios';

export class ColorChooser extends React.Component {

    state = {
        newSwatchesList: [],
        form: null,
        swatchCamelCaseNameList: []
    }

    addNewSwatch = () => {
        let timestamp = Date.now();

        this.setState({
            newSwatchesList: [...this.state.newSwatchesList, timestamp]
        });
    }

    handleSwatchNameChange = (event, timestamp) => {
        let tempElementName = event.target.name;
        let tempElementValue = event.target.value;
        let uniqueName = _.camelCase(event.target.value);

        let tempForm = this.state.form;
        let tempSwatchCamelCaseNameList = this.state.swatchCamelCaseNameList;

        if (tempElementValue !== "") {
            let uniqueNameObj = {};

            let previousCamelCaseObj = _.find(tempSwatchCamelCaseNameList, { timestamp: timestamp });
            let previousCamelCaseIndex = _.findIndex(tempSwatchCamelCaseNameList, { timestamp: timestamp })
            let previousCamelCaseName;

            if (previousCamelCaseObj !== undefined && Object.keys(previousCamelCaseObj).length > 0) {
                // Store previous camel case name to here first
                previousCamelCaseName = previousCamelCaseObj['name'];
            }

            if (!_.has(tempForm, uniqueName)) {
                // If this unique name never exists in form state
                let tempSwatchCamelCaseNameObj = {};

                if (previousCamelCaseName && tempForm[uniqueName] === undefined) {
                    let mergedCamelCaseObj = Object.assign(tempForm, { [uniqueName]: tempForm[previousCamelCaseName] });

                    uniqueNameObj = mergedCamelCaseObj;

                    // Create new camel case name object
                    tempSwatchCamelCaseNameObj = {
                        name: uniqueName,
                        timestamp: timestamp
                    }
                    
                    if (_.has(uniqueNameObj, previousCamelCaseName)) {
                        // Delete previous camel case name object
                        this.state.swatchCamelCaseNameList.splice(previousCamelCaseIndex, 1);
                        delete uniqueNameObj[previousCamelCaseName];
                    }

                } else {
                    tempSwatchCamelCaseNameObj = {
                        name: uniqueName,
                        timestamp: timestamp
                    }

                    uniqueNameObj[uniqueName] = {}

                    uniqueNameObj[uniqueName] = _.set(
                        uniqueNameObj[uniqueName],
                        tempElementName, tempElementValue
                    );
                }

                this.setState({
                    swatchCamelCaseNameList: [...this.state.swatchCamelCaseNameList, tempSwatchCamelCaseNameObj],
                    form: { ...this.state.form, ...uniqueNameObj }
                });
            } else {
                // If unique name exists in form state
                alert('Duplicate color name is not allowed 🙅 ');
                return false;
            }

        }
    }

    processPicker = (event) => {
        let tempElementValue = event.target.value;
        let uniqueName = event.target.getAttribute("unique_name");

        if (tempElementValue !== 0) {
            let previousFormState = this.state.form;
            let newFormState = previousFormState;

            let tempColorPicker = [];

            Array.from(Array(parseInt(tempElementValue))).forEach((picker, key) => {
                tempColorPicker.push({
                    value: ""
                })
            });
    
            Object.assign(newFormState[uniqueName], { colorPicker: tempColorPicker })
            Object.assign(newFormState[uniqueName]['swatchInfo'], { swatchColorAmount: parseInt(tempElementValue) })

            this.setState({
                form: { ...this.state.form, ...newFormState }
            });
        }
    }

    handleColorPickerChangeCompleted = (color, name) => {
        let tempElementName = name;
        let selectedColor = color.hex;

        this.setState({
            form: _.set(
                { ...this.state.form },
                tempElementName, selectedColor
            )
        });
    }

    handleColorChange = (colorObj, name) => {
        let tempElementName = name;
        let selectedColor = colorObj['color'];

        this.setState({
            form: _.set(
                { ...this.state.form },
                tempElementName, selectedColor
            )
        })
    }

    handleNativeColorChange = (event, name) => {
        let tempElementName = name;
        let selectedColor = event.target.value;

        this.setState({
            form: _.set(
                { ...this.state.form },
                tempElementName, selectedColor
            )
        })
    }

    handleSaveButton = (event) => {
        event.preventDefault();

        this.handleSubmit();
    }

    handleSubmit = () => {
        const host = AppConfig.API_URL;
        let formData = this.state.form;

        let storeID = this.props.storeID;

        axios
            .post(host + storeID + "/customColor/update", formData)
            .then((resultPost) => {
            })
    }

    componentDidMount() {
        const host = AppConfig.API_URL;
        let storeID = this.props.storeID
        let productID = this.props.productID
        axios
            .get(host + 'product/storeID/' + storeID + '/product/' + productID + '/details')
            .then((result) => {
                const generateSwatchesState = (options) => {
                    return Object.keys(result.data).map((item, index) => {
                        let tempReturn;

                        if (options === "UNIQUE_NAME_AND_TIMESTAMP") {
                            tempReturn = {
                                name: item,
                                timestamp: `${Date.now()}_${index}`
                            };
                        } else if (options === "TIMESTAMP") {
                            tempReturn = `${Date.now()}_${index}`;
                        }

                        return tempReturn;
                    })
                }

                this.setState({
                    form: result.data,
                    newSwatchesList: generateSwatchesState("TIMESTAMP"),
                    swatchCamelCaseNameList: [...this.state.swatchCamelCaseNameList, ...generateSwatchesState("UNIQUE_NAME_AND_TIMESTAMP")]
                });
            })
    }

    SwatchForm = (swatchCamelCaseNameList, form, timestamp) => {
        let swatchName = {};
        let swatchColorAmount = {};

        let currentCamelCaseNameArray = [];
        let currentCamelCaseNameObj = {};

        if (swatchCamelCaseNameList.length > 0) {
            currentCamelCaseNameObj = _.find(swatchCamelCaseNameList, { timestamp: timestamp });
            currentCamelCaseNameArray.push(currentCamelCaseNameObj);

            if (currentCamelCaseNameObj !== undefined && Object.keys(currentCamelCaseNameObj).length > 0) {
                let tempCamelCaseElementName = currentCamelCaseNameObj['name'];
    
                swatchName = {
                    defaultValue: form[tempCamelCaseElementName]['swatchInfo']['swatchName']
                }
            }
        } else {
            currentCamelCaseNameArray = [];
        }

        return (
            // <modal>
            <div className="row mt-2" key={timestamp}>


                <div className="col-2" marginLeft = '100px'>
                    <br/>
                    <input
                        type="text"
                        name={"swatchInfo[swatchName]"}
                        placeholder="Enter color name"
                        onBlur={(event) => this.handleSwatchNameChange(event, timestamp)}
                        className="form-control"
                        {...swatchName}
                    />
                </div>


                {currentCamelCaseNameArray.length > 0 && currentCamelCaseNameArray[0] !== undefined ?
                    [
                        currentCamelCaseNameArray.map((elementObject, key) => {

                            let elementName = elementObject['name'];

                            if (
                                form.hasOwnProperty(elementName) &&
                                form[elementName].hasOwnProperty('swatchInfo') &&
                                form[elementName]['swatchInfo'].hasOwnProperty('swatchColorAmount')
                            ) {
                                swatchColorAmount = form[elementName]['swatchInfo']['swatchColorAmount'];
                            }

                            return (
                                <div className="col-2" key={key}>
                                    <br/>
                                    <select
                                        variant = 'outlined'
                                        name={elementName + "[swatchInfo][swatchColorAmount]"}
                                        unique_name={elementName}
                                        onChange={this.processPicker}
                                        key={key}
                                        className="form-control"
                                        defaultValue={swatchColorAmount}
                                    >
                                        <option value={0}>-- Select --</option>
                                        <option value={1}>One color</option>
                                        <option value={2}>Two color</option>
                                        <option value={3}>Three color</option>
                                        <option value={4}>Four color</option>
                                    </select>
                                    <br/>
                                </div>
                            )
                        })
                    ] : null
                }

                {currentCamelCaseNameArray.length > 0 && currentCamelCaseNameArray[0] !== undefined ?
                    [
                        currentCamelCaseNameArray.map((elementObject, key) => {

                            let elementName = elementObject['name'];

                            let swatchColorAmount = '';

                            if (
                                form.hasOwnProperty(elementName) &&
                                form[elementName].hasOwnProperty('swatchInfo') &&
                                form[elementName]['swatchInfo'].hasOwnProperty('swatchColorAmount')
                            ) {
                                swatchColorAmount = form[elementName]['swatchInfo']['swatchColorAmount'];
                            }

                            return (
                                <div className="col-4" key={key}>
                                    {swatchColorAmount ?
                                        [Array.from(Array(parseInt(swatchColorAmount))).map((picker, key) => {
                                            const checkFormState = (form) => {
                                                return form[elementName].hasOwnProperty('colorPicker') &&
                                                    form[elementName]['colorPicker'].hasOwnProperty(key)
                                            }
                                            return (
                                                <div className="d-inline p-2" key={key}>
                                                    {checkFormState(form) ?
                                                        // <ColorPicker
                                                        //     animation="slide-up"
                                                        //     defaultColor={'#FFF'}
                                                        //     onChange={(color) => this.handleColorChange(color, `${elementName}[colorPicker][${key}][][value]`)}
                                                        //     color={form[elementName]['colorPicker'][key]['value']}
                                                        // /> : null
                                                        <input
                                                            type="color"
                                                            onChange={(event) => this.handleNativeColorChange(event, `${elementName}[colorPicker][${key}][][value]`)}
                                                            value={this.state.form}
                                                        />: null
                                                    }
                                                </div>
                                            )
                                        })] : null
                                    }
                                </div>
                            )
                        })
                    ] : null
                }

            </div>
            // </modal>
        )
    }

    render() {
        const { newSwatchesList, swatchCamelCaseNameList, form } = this.state;

        return (
            <div className="container">
                {/* <h2>Swatches list</h2> */}

                <button variant="outlined" onClick={this.addNewSwatch} >Add a color</button>

                <form onSubmit={this.handleSubmit}>
                    {newSwatchesList.map((swatchTimestamp, key) => {
                        return (
                            this.SwatchForm(swatchCamelCaseNameList, form, swatchTimestamp)
                        )
                    })}

                    <br/>
                    <button variant="outlined" color="primary"onClick={this.handleSaveButton}>Save</button>
                </form>


            </div>
        );
    }
}

export default ColorChooser;