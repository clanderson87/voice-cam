import React from 'react';
/*
Takes props:
  inputGroup: [{label: string, type: string(input-type), value: num || string ||'controlled', propertyName: 'string' onChange: function(event)}],
    -label: string -> label for the input
    -type: string -> string of input-type
    -value: 'controlled' -> sets the value of this input to {this.state['propertyName']} (recommended)
          : ControlsComponent.props.inputGroup[i].type -> sets the value
        -use of "value: 'controlled'" does not need an 'onChange' prop
    -propertyName: string -> property of ControlsComponent.state that value
    -onChange: function(event) -> function to run on event.target.value change (optional, defaults to ControlsComponent.setState())
  buttonGroup:[{text: string, onClick: 'setState' || function(), propertyName: string }]
    -text: string -> string for button text
    -onClick: 'setState' -> to setState of controlsComponent
            : function() -> to a function other than setState
    -propertyName: string - > name of ControlsComponent.state to effect
    -check: bool -> buttons should act like checkboxes and have different styles depending on the status of state that they effect
  inputStyle: style object for each individual input of inputGroup
  inputGroupStyle: style for the inputGroup as a whole
  buttonStyle: {standard: {style object for each individual button of buttonGroup}, checked: {style obj for each clicked button}}
  buttonGroupStyle: style for the buttonGroup as a whole
  submitButton: {text: string, onClick: function(ControlsComponent.state)}
    -text: string -> text for submit button (defaults to 'submit')
    -onClick: function(ControlsComponent.state) -> function to call on clicking of submit button
      (REQUIRED!)
      (RECOMMENDED: App.setState({data: ControlsComponent.state}))
  submitButtonStyle: style object for the submit button

*/

const generateRandomKeyString = () => {
  return Math.random().toString(36).substring(2,15)
}

class ControlsComponent extends React.Component {
  constructor(props){
    super();
    this.state = {};
  }

  inputKeys = [
    'asd3safe','dejj7dos','irqn94sd','okweda4s','plasf2jw'
  ];

  componentDidMount(){
    if(this.props.inputGroup){
      for (let i = 0; i < this.props.inputGroup.length; i++){
        this.inputKeys.push(generateRandomKeyString());
      };
    }
  }

  render(){
    return <div style= {this.props.componentStyle}>
      {this.props.inputGroup ?
      <div style = { this.props.inputGroupStyle }>
        {this.props.inputGroup.map((obj, i)=> {
          return <div key = {this.inputKeys[i]}>
            <input style = {this.props.inputStyle} placeholder={obj.label} type={obj.type} value={obj.value === 'controlled' ? this.state[obj.propertyName] : obj.value } onChange={obj.onChange ? obj.onChange : (e) => this.setState({[obj.propertyName]: e.target.value })} />
          </div>
        })}
      </div> : null }
      { this.props.buttonGroup ?
      <div style = {this.props.buttonGroupStyle}>
        {this.props.buttonGroup.map((btn) => {
          return <button
            key = {generateRandomKeyString()}
            onClick = {btn.onClick === 'setState' ?
              () => this.setState({[btn.propertyName]: !this.state[btn.propertyName]}) :
              btn.onClick}>
            {btn.text}</button>
        })}
      </div> : null }
      { this.props.submitButton ?
      <button style = {this.props.submitButtonStyle} onClick = {() => this.props.submitButton.onClick(this.state)}>{this.props.submitButton.text}</button>
      : null }
    </div>
  }
}

export default ControlsComponent;
