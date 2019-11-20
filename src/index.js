import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const equalsStyle = {
    background: "#0378A6",
    position: "absolute",
    height: 140,
    bottom: 5
  },
  clearStyle = { background: "#BF3952" },
  operatorStyle = { background: "grey" },
  isOperator = /[x/+-]/,
  endsWithOperator = /[x+-/]$/,
  endsWithNegativeSign = /[x/+]-$/;

class Buttons extends React.Component {
  render() {
    return (
      <div>
        <button
          className="jumbo"
          id="clear"
          value="AC"
          style={clearStyle}
          onClick={this.props.initialize}
        >
          AC
        </button>
        <button
          id="divide"
          value="/"
          style={operatorStyle}
          onClick={this.props.operators}
        >
          /
        </button>
        <button
          id="multiply"
          value="x"
          style={operatorStyle}
          onClick={this.props.operators}
        >
          x
        </button>
        <button id="seven" value="7" onClick={this.props.numbers}>
          7
        </button>
        <button id="eight" value="8" onClick={this.props.numbers}>
          8
        </button>
        <button id="nine" value="9" onClick={this.props.numbers}>
          9
        </button>
        <button
          id="subtract"
          value="-"
          style={operatorStyle}
          onClick={this.props.operators}
        >
          -
        </button>
        <button id="four" value="4" onClick={this.props.numbers}>
          4
        </button>
        <button id="five" value="5" onClick={this.props.numbers}>
          5
        </button>
        <button id="six" value="6" onClick={this.props.numbers}>
          6
        </button>
        <button
          id="add"
          value="+"
          style={operatorStyle}
          onClick={this.props.operators}
        >
          +
        </button>
        <button id="one" value="1" onClick={this.props.numbers}>
          1
        </button>
        <button id="two" value="2" onClick={this.props.numbers}>
          2
        </button>
        <button id="three" value="3" onClick={this.props.numbers}>
          3
        </button>
        <button
          className="jumbo"
          id="zero"
          value="0"
          onClick={this.props.numbers}
        >
          0
        </button>
        <button id="decimal" value="." onClick={this.props.decimal}>
          .
        </button>
        <button
          id="equals"
          value="="
          style={equalsStyle}
          onClick={this.props.evaluate}
        >
          =
        </button>
      </div>
    );
  }
}

class Output extends React.Component {
  render() {
    return (
      <div className="outputScreen" id="display">
        {this.props.currentValue}
      </div>
    );
  }
}

class Formula extends React.Component {
  render() {
    return <div className="formulaScreen">{this.props.formula}</div>;
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVal: "0",
      prevVal: "0",
      formula: "",
      currentSign: "pos"
    };
    this.handleNumbers = this.handleNumbers.bind(this);
    this.maxDigitWarning = this.maxDigitWarning.bind(this);
    this.handleOperators = this.handleOperators.bind(this);
    this.handleEvaluate = this.handleEvaluate.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.initialize = this.initialize.bind(this);
  }

  maxDigitWarning() {
    this.setState({
      currentVal: "Digit Limit Met",
      prevVal: this.state.currentVal
    });
    setTimeout(() => this.setState({ currentVal: this.state.prevVal }), 1000);
  }

  handleOperators(e) {
    if (!this.state.currentVal.includes("Limit")) {
      const value = e.target.value;
      const { formula, prevVal, evaluated } = this.state; //Object destructuring. It assigns this.state.formula to the local constant formula,...
      this.setState({ currentVal: value, evaluated: false });
      if (evaluated) {
        this.setState({ formula: prevVal + value });
      } else if (!endsWithOperator.test(formula)) {
        this.setState({
          prevVal: formula,
          formula: formula + value
        });
      } else if (!endsWithNegativeSign.test(formula)) {
        this.setState({
          formula:
            (endsWithNegativeSign.test(formula + value) ? formula : prevVal) +
            value
        });
      } else if (value !== "-") {
        this.setState({
          formula: prevVal + value
        });
      }
    }
  }

  handleNumbers(e) {
    if (!this.state.currentVal.includes("Limit")) {
      const { currentVal, formula, evaluated } = this.state; //Object destructuring. It assigns this.state.currentVal to the local constant currentVal,...
      const value = e.target.value;
      this.setState({ evaluated: false });
      if (currentVal.length > 20) {
        this.maxDigitWarning();
      } else if (evaluated) {
        this.setState({
          currentVal: value,
          formula: value !== "0" ? value : ""
        });
      } else {
        this.setState({
          currentVal:
            currentVal === "0" || isOperator.test(currentVal)
              ? value
              : currentVal + value,
          formula:
            currentVal === "0" && value === "0"
              ? formula
              : /([^.0-9]0)$/.test(formula)
              ? formula.slice(0, -1) + value
              : formula + value
        });
      }
    }
  }

  handleEvaluate() {
    if (!this.state.currentVal.includes("Limit")) {
      let expression = this.state.formula;
      while (endsWithOperator.test(expression)) {
        expression = expression.slice(0, -1);
      }
      expression = expression.replace(/x/g, "*").replace(/‑/g, "-");
      let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
      this.setState({
        currentVal: answer.toString(),
        formula:
          expression.replace(/\*/g, "⋅").replace(/-/g, "‑") + "=" + answer,
        prevVal: answer,
        evaluated: true
      });
    }
  }

  handleDecimal() {
    if (this.state.evaluated === true) {
      this.setState({
        currentVal: "0.",
        formula: "0.",
        evaluated: false
      });
    } else if (
      !this.state.currentVal.includes(".") &&
      !this.state.currentVal.includes("Limit")
    ) {
      this.setState({ evaluated: false });
      if (this.state.currentVal.length > 20) {
        this.maxDigitWarning();
      } else if (
        endsWithOperator.test(this.state.formula) ||
        (this.state.currentVal === "0" && this.state.formula === "")
      ) {
        this.setState({
          currentVal: "0.",
          formula: this.state.formula + "0."
        });
      } else {
        this.setState({
          currentVal: this.state.formula.match(/(-?\d+\.?\d*)$/)[0] + ".",
          formula: this.state.formula + "."
        });
      }
    }
  }

  initialize() {
    this.setState({
      currentVal: "0",
      prevVal: "0",
      formula: "",
      currentSign: "pos",
      evaluated: false
    });
  }

  render() {
    return (
      <div>
        <div className="calculator">
          <Formula formula={this.state.formula.replace(/x/g, "⋅")} />
          <Output currentValue={this.state.currentVal} />
          <Buttons
            numbers={this.handleNumbers}
            operators={this.handleOperators}
            evaluate={this.handleEvaluate}
            decimal={this.handleDecimal}
            initialize={this.initialize}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Calculator />, document.getElementById("root"));
